const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

functions.auth.user().onCreate(event => {
  const user = event.data;

  
})