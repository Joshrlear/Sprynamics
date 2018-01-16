const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const mailgun = require('mailgun-js')({
  apiKey: 'key-2a4943cedf61f904ab8a9e041cc399d2', 
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
  mailgun.messages().send(email, function(err, body) {
    console.log(body);
  });
});