import * as functions from 'firebase-functions'
import * as email from '../controllers/email'

/**
 * Sends a welcome email when a new user is created.
 */
export const createUserAccount = functions.auth.user().onCreate(user => {
  email.send({
    from: 'Sprynamics <noreply@notifications.sprynamics.com>',
    to: user.email,
    subject: 'Welcome to Sprynamics!',
    text: 'A new user was created: ' + user.email
  })
})
