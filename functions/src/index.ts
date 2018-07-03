//import * as functions from 'firebase-functions'
const functions = require('firebase-functions');
import * as admin from 'firebase-admin'

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sprynamics.firebaseio.com"
});
//admin.initializeApp(functions.config().firebase);

export * from './functions/email.functions'
export * from './functions/braintree.functions'
export * from './functions/linkedin.functions'
