const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({ origin: true });
const path = require('path');
const fs = require('fs');
const os = require('os');
const PDFImage = require('pdf-image').PDFImage;
const rp = require('request-promise');

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
