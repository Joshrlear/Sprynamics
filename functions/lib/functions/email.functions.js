"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const email = require("../controllers/email");
/**
 * Sends a welcome email when a new user is created.
 */
exports.createUserAccount = functions.auth.user().onCreate(user => {
    email.send({
        from: 'Sprynamics <noreply@notifications.sprynamics.com>',
        to: user.email,
        subject: 'Welcome to Sprynamics!',
        text: 'A new user was created: ' + user.email
    });
});
//# sourceMappingURL=email.functions.js.map