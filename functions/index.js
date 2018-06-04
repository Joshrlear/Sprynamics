const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./secrets/service-account.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
});
const cors = require('cors')({ origin: true });
const path = require('path');
const fs = require('fs');
const os = require('os');
const PDFImage = require('pdf-image').PDFImage;
const rp = require('request-promise');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const OAUTH_SCOPES = ['r_basicprofile', 'r_emailaddress'];

/**
 * Creates a configured LinkedIn API Client instance.
 */
function linkedInClient() {
  // LinkedIn OAuth 2 setup
  // TODO: Configure the `linkedin.client_id` and `linkedin.client_secret` Google Cloud environment variables.
  return require('node-linkedin')(
      functions.config().linkedin.client_id,
      functions.config().linkedin.client_secret,
      `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/linkedin-popup.html`);
}

/**
 * Redirects the User to the LinkedIn authentication consent screen. Also the 'state' cookie is set for later state
 * verification.
 */
exports.redirect = functions.https.onRequest((req, res) => {
  const Linkedin = linkedInClient();

  cookieParser()(req, res, () => {
    const state = req.cookies.state || crypto.randomBytes(20).toString('hex');
    console.log('Setting verification state:', state);
    res.cookie('state', state.toString(), {
      maxAge: 3600000,
      secure: true,
      httpOnly: true,
    });
    Linkedin.auth.authorize(res, OAUTH_SCOPES, state.toString());
  });
});

/**
 * Exchanges a given LinkedIn auth code passed in the 'code' URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
 * The Firebase custom auth token is sent back in a JSONP callback function with function name defined by the
 * 'callback' query parameter.
 */
exports.token = functions.https.onRequest((req, res) => {
  const Linkedin = linkedInClient();

  try {
    return cookieParser()(req, res, () => {
      if (!req.cookies.state) {
        throw new Error('State cookie not set or expired. Maybe you took too long to authorize. Please try again.');
      }
      console.log('Received verification state:', req.cookies.state);
      Linkedin.auth.authorize(OAUTH_SCOPES, req.cookies.state); // Makes sure the state parameter is set
      console.log('Received auth code:', req.query.code);
      console.log('Received state:', req.query.state);
      Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, (error, results) => {
        if (error) {
          throw error;
        }
        console.log('Received Access Token:', results.access_token);
        const linkedin = Linkedin.init(results.access_token);
        linkedin.people.me((error, userResults) => {
          if (error) {
            throw error;
          }
          console.log('Auth code exchange result received:', userResults);

          // We have a LinkedIn access token and the user identity now.
          const accessToken = results.access_token;
          const linkedInUserID = userResults.id;
          const profilePic = userResults.pictureUrl;
          const userName = userResults.formattedName;
          const email = userResults.emailAddress;

          // Create a Firebase account and get the Custom Auth Token.
          return createFirebaseAccount(linkedInUserID, userName, profilePic, email, accessToken).then(
            (firebaseToken) => {
              // Serve an HTML page that signs the user in and updates the user profile.
              return res.type('application/javascript').jsonp({
                token: firebaseToken,
              });
            });
        });
      });
    });
  } catch (error) {
    return res.jsonp({
      error: error.toString,
    });
  }
});

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /linkedInAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
function createFirebaseAccount(linkedinID, displayName, photoURL, email, accessToken) {
  // The UID we'll assign to the user.
  const uid = `linkedin:${linkedinID}`;

  // Save the access token tot he Firebase Realtime Database.
  const databaseTask = admin.database().ref(`/linkedInAccessToken/${uid}`).set(accessToken);

  // Create or update the user account.
  const userCreationTask = admin.auth().updateUser(uid, {
    displayName: displayName,
    photoURL: photoURL,
    email: email,
    emailVerified: true,
  }).catch((error) => {
    // If user does not exists we create it.
    if (error.code === 'auth/user-not-found') {
      return admin.auth().createUser({
        uid: uid,
        displayName: displayName,
        photoURL: photoURL,
        email: email,
        emailVerified: true,
      });
    }
    throw error;
  });

  // Wait for all async task to complete then generate and return a custom auth token.
  return Promise.all([userCreationTask, databaseTask]).then(() => {
    // Create a Firebase custom auth token.
    return admin.auth().createCustomToken(uid);
  }).then((token) => {
    console.log('Created Custom token for UID "', uid, '" Token:', token);
    return token;
  });
}

// Mailgun
const mailgun_creds = require('./secrets/mailgun');
const mailgun = require('mailgun-js')({
  apiKey: mailgun_creds.apiKey,
  domain: 'notifications.sprynamics.com'
});

/**
 * Sends a welcome email when a new user is created.
 */
exports.createUserAccount = functions.auth.user().onCreate(event => {
  const user = event.data;
  const email = {
    from: 'Sprynamics <noreply@notifications.sprynamics.com>',
    to: user.email,
    subject: 'Welcome to Sprynamics!',
    text: 'A new user was created: ' + user.email
  }
  mailgun.messages().send(email, function (err, body) {
    console.log(body);
  });
});

// Braintree
const braintree = require('braintree');
const braintree_creds = require('./secrets/braintree.js');
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: braintree_creds.merchantId,
  publicKey: braintree_creds.publicKey,
  privateKey: braintree_creds.privateKey,
});

/**
 * Sends the Braintree client token for a given customerId
 */
exports.getClientToken = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const options = {};
    if (req.body.customerId) {
      console.log(req.body.customerId);
      options.customerId = req.body.customerId;
    }
    gateway.clientToken.generate(options, (err, tokenRes) => {
      if (err) {
        res.status(400).send({ message: err.message })
      } else {
        res.status(200).send({
          message: 'Successfully generated token',
          token: tokenRes.clientToken
        })
      }
    })
  })
})

/**
 * Creates a new Braintree customer
 */
exports.customer = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    gateway.customer.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    }, (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(400).send({ message: err.message });
      } else {
        res.status(201).send({ message: 'success', customerId: result.customer.id });
      }
    })
  })
})

// POST transaction
exports.checkout = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    console.log(req.body);
    const nonce = req.body.nonce;
    const quantity = req.body.quantity;
    const totalPrice = calculatePricing(quantity).total;
    gateway.transaction.sale({
      amount: totalPrice,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    }, (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(400).send({ message: err.message });
      } else {
        // store into the orders database
        delete req.body.token$; // remove the client token observable
        req.body.createdAt = admin.firestore.FieldValue.serverTimestamp(); // add timestamp
        //admin.firestore().doc(`orders/${req.body.id}`).set(req.body); // add order to database
        // send email receipt
        const emailReceipt = {
          from: 'Sprynamics <noreply@notifications.sprynamics.com>',
          to: 'audererm@gmail.com',
          subject: `Your order with Sprynamics: ${req.body.id}`,
          html: require('./mail_templates/order_receipt')(req.body)
        }
        console.log('sending email');
        mailgun.messages().send(emailReceipt, function (err, body) {
          if (err) console.error(err);
          console.log(body);
          console.log('email sent');
        });

        const shipping = req.body.shipping;

        const emailToPrinter = {
          from: 'Sprynamics <noreply@notifications.sprynamics.com>',
          // to: 'jeffrey.wallace@comcast.net',
          to: 'audererm@gmail.com',
          subject: `${req.body.firstName} ${req.body.lastName}, ${req.body.propertyAddress}, ${req.body.product} ${req.body.size}`,
          html: `
            <div>Hi Jeff,</div>
            <br>
            <div>
              ${req.body.isMailingList ?
              'Please print and mail the PDF below. Bill me.' :
              `Please print the PDF below and ship to ${shipping.address1} ${shipping.address2}, ${shipping.city}, ${shipping.state} ${shipping.zipCode}`
            }
            </div>
            <br>
            <div>
              Design PDF for this order: ${req.body.pdfUrl}
            </div>
            <br>
            <div>Thank you</div>
            <br>
            <br>
            <hr>
            <div>
              This is an automated email. If you have any questions, please contact Josh Lear at joshrlear@gmail.com or by phone at 619-507-6807.
            </div>
          `
        }

        console.log('sending email to printer');
        mailgun.messages().send(emailToPrinter, function (err, body) {
          if (err) console.error(err);
          console.log('email sent to printer');
          res.status(200).send({ message: 'Success!' });
        });
      }
    })
  })
});

// Get SlipStream Token
exports.getSlipstreamToken = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const endpoint = 'https://slipstream.homejunction.com/ws/api/authenticate?license=1BF9-C13B-D5BE-7F36';
    return rp.get(endpoint, {json: true})
      .then(apiRes => {
        const result = {
          token: apiRes.result.token,
          expires: apiRes.result.expires
        };
        res.send(result);
      })
      .catch(err => {
        console.error(err);
        res.send({ error: err.message })
      });
  });
});

function calculatePricing(amt) {
  const pricing = {};
  if (!amt) {
    pricing.subtotal = 0;
    pricing.shipping = 0;
    pricing.total = 0;
    return pricing;
  }
  amt *= 0.99;
  amt += 20; // design cost
  pricing.subtotal = amt;
  if (amt <= 15) pricing.shipping = 4.99;
  else if (amt <= 20) pricing.shipping = 5.99;
  else if (amt <= 30) pricing.shipping = 6.49;
  else if (amt <= 50) pricing.shipping = 6.99;
  else if (amt <= 70) pricing.shipping = 7.99;
  else if (amt <= 90) pricing.shipping = 8.49;
  else if (amt <= 150) pricing.shipping = 12.99;
  else if (amt <= 200) pricing.shipping = 15.49;
  else if (amt <= 300) pricing.shipping = 16.99;
  else if (amt <= 500) pricing.shipping = 23.99;
  else pricing.shipping = 23.99;
  pricing.total = amt + pricing.shipping;

  return pricing;
}
