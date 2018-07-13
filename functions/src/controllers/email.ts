import * as functions from 'firebase-functions'
import * as mailgunModule from 'mailgun-js'

const mailgun = mailgunModule({
  apiKey: functions.config().mailgun.key,
  domain: 'notifications.sprynamics.com'
})

export function send(email) {
  return new Promise((resolve, reject) => {
    mailgun.messages().send(email, (err, body) => {
      if (err) {
        reject(err)
      }
      resolve(body)
    })
  })
}