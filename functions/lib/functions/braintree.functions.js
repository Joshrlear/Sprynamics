"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const braintree = require("braintree");
const https = require("../controllers/https");
const email = require("../controllers/email");
const order_receipt_email_1 = require("../email-templates/order-receipt.email");
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
exports.client_token = https.route("POST", (req, res) => {
    const customerId = req.body.customerId;
    gateway.clientToken.generate({ customerId }, (err, tokenRes) => {
        if (err) {
            console.error(err.message);
            return res.status(400).send({ message: err.message });
        }
        console.log("successfully generated token", tokenRes);
        return res.status(200).send({
            message: "Successfully generated token",
            token: tokenRes.clientToken
        });
    });
});
/**
 * POST /new_customer
 *
 * Creates a new Braintree customer
 */
exports.new_customer = https.route("POST", (req, res) => {
    gateway.customer.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }, (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(400).send({ message: err.message });
        }
        res.status(201).send({ message: "success", customerId: result.customer.id });
    });
});
/**
 * POST /checkout
 *
 * Makes a checkout transaction in Braintree
 */
exports.checkout = https.route("POST", (req, res) => {
    const { nonce, chargeAmount, uid } = req.body;
    gateway.transaction.sale({
        amount: chargeAmount,
        paymentMethodNonce: nonce,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            console.error(err.message);
            res.status(400).send({ message: err.message });
        }
        else {
            req.body.createdAt = admin.firestore.FieldValue.serverTimestamp(); // add timestamp
            try {
                yield admin
                    .firestore()
                    .collection("transactions")
                    .add(req.body); // add order to database
                const user = (yield admin
                    .firestore()
                    .doc(`users/${req.body.uid}`)
                    .get()).data();
                yield email.send({
                    from: "Sprynamics <noreply@notifications.sprynamics.com>",
                    to: user.email,
                    subject: "Welcome to Sprynamics!",
                    html: order_receipt_email_1.default(req.body)
                });
                res.status(200).send({ message: "success!" });
                console.log("successful checkout completed");
            }
            catch (err) {
                console.error(err.message);
                res.status(400).send({ message: err.message });
            }
        }
    }));
});
//# sourceMappingURL=braintree.functions.js.map