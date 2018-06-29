import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

export * from './functions/email.functions'
export * from './functions/braintree.functions'
export * from './functions/linkedin.functions'