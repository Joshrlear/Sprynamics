"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const braintree = require("braintree");
const https = require("../controllers/https");
const env = functions.config();
/**
 * Initialize Braintree
 */
const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: env.sprynamics.merchant_id,
    publicKey: env.sprynamics.public_key,
    privateKey: env.sprynamics.private_key
});
/**
 * GET /client_token
 *
 * Sends the Braintree client token for a given customerId
 */
exports.client_token = https.route('POST', (req, res) => {
    const customerId = req.body.customerId;
    gateway.clientToken.generate({ customerId }, (err, tokenRes) => {
        if (err) {
            console.error(err.message);
            return res.status(400).send({ message: err.message });
        }
        console.log('successfully generated token', tokenRes);
        return res.status(200).send({
            message: 'Successfully generated token',
            token: tokenRes.clientToken
        });
    });
});
/**
 * POST /new_customer
 *
 * Creates a new Braintree customer
 */
exports.new_customer = https.route('POST', (req, res) => {
    gateway.customer.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }, (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(400).send({ message: err.message });
        }
        res.status(201).send({ message: 'success', customerId: result.customer.id });
    });
});
/**
 * POST /checkout
 *
 * Makes a checkout transaction in Braintree
 */
exports.checkout = https.route('POST', (req, res) => {
    const { nonce, chargeAmount, uid } = req.body;
    gateway.transaction.sale({
        amount: chargeAmount,
        paymentMethodNonce: nonce,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(400).send({ message: err.message });
        }
        else {
            req.body.createdAt = admin.firestore.FieldValue.serverTimestamp(); // add timestamp
            admin
                .firestore()
                .collection('transactions')
                .add(req.body); // add order to database
            res.status(200).send({ message: 'success!' });
            console.log('successful checkout completed');
        }
    });
});
//# sourceMappingURL=braintree.functions.js.map