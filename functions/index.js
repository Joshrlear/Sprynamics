const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({origin: true});

// Mailgun

const mailgun_creds = require('./secrets/mailgun');
const mailgun = require('mailgun-js')({
  apiKey: mailgun_creds.apiKey,
  domain: 'notifications.sprynamics.com'
});

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

// GET client token
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

// POST new customer
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
    });  
  })
})

// POST transaction
exports.checkout = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
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
        res.status(200).send({ message: 'Success!' });
        // store into the orders database
        admin.firestore().collection('orders').add(req.body)
      }
    })
  })
})

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