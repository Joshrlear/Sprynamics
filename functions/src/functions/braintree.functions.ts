import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as braintree from "braintree"
import * as https from "../controllers/https"
import * as email from "../controllers/email"
import orderReceiptEmail from "../email-templates/order-receipt.email"

const env = functions.config()

/**
 * Initialize Braintree
 */
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: env.sprynamics.merchant_id,
  publicKey: env.sprynamics.public_key,
  privateKey: env.sprynamics.private_key
})

/**
 * GET /client_token
 *
 * Sends the Braintree client token for a given customerId
 */
export const client_token = https.route("POST", (req, res) => {
  const customerId = req.body.customerId
  gateway.clientToken.generate({ customerId }, (err, tokenRes) => {
    if (err) {
      console.error(err.message)
      return res.status(400).send({ message: err.message })
    }
    console.log("successfully generated token", tokenRes)
    return res.status(200).send({
      message: "Successfully generated token",
      token: tokenRes.clientToken
    })
  })
})

/**
 * POST /new_customer
 *
 * Creates a new Braintree customer
 */
export const new_customer = https.route("POST", (req, res) => {
  gateway.customer.create(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    },
    (err, result) => {
      if (err) {
        console.error(err.message)
        return res.status(400).send({ message: err.message })
      }
      res.status(201).send({ message: "success", customerId: result.customer.id })
    }
  )
})

/**
 * POST /checkout
 *
 * Makes a checkout transaction in Braintree
 */
export const checkout = https.route("POST", (req, res) => {
  const { nonce, chargeAmount, userId } = req.body
  gateway.transaction.sale(
    {
      amount: chargeAmount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    },
    async (err, result) => {
      if (err) {
        console.error(err.message)
        res.status(400).send({ message: err.message })
      } else {
        req.body.createdAt = admin.firestore.FieldValue.serverTimestamp() // add timestamp
        try {
          await admin
            .firestore()
            .collection("transactions")
            .add(req.body) // add order to database
          const user = (await admin
            .firestore()
            .doc(`users/${userId}`)
            .get()).data()
          await email.send({
            from: "Sprynamics <noreply@notifications.sprynamics.com>",
            to: user.email,
            subject: `Sprynamics order: ${req.body.id}`,
            html: orderReceiptEmail(req.body)
          })
          res.status(200).send({ message: "success!" })
        } catch (err) {
          console.error(err.message)
          res.status(400).send({ message: err.message })
        }
      }
    }
  )
})
