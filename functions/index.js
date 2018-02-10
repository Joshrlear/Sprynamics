const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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
  gateway.clientToken.generate({}, (err, tokenRes) => {
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

// POST transaction
exports.checkout = functions.https.onRequest((req, res) => {
  const nonce = req.body.nonce;
  gateway.transaction.sale({
    amount: '5.00',
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
    }
  })
})