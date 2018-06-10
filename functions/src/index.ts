import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()

export * from './functions/email.functions'
export * from './functions/braintree.functions'