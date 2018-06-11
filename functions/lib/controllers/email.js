"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const mailgunModule = require("mailgun-js");
const mailgun = mailgunModule({
    apiKey: functions.config().mailgun.key,
    domain: 'notifications.sprynamics.com'
});
function send(email) {
    return new Promise((resolve, reject) => {
        mailgun.messages().send(email, (err, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    });
}
exports.send = send;
//# sourceMappingURL=email.js.map