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
const nodeLinkedin = require("node-linkedin");
const crypto = require("crypto");
const fetch = require("node-fetch");
const FormData = require("form-data");
const OAUTH_SCOPES = ['r_basicprofile', 'r_emailaddress'];
const REDIRECT_URI = 'https://sprynamics.firebaseapp.com/account/login';
const { client_id, client_secret } = functions.config().linkedin;
/**
 * Creates a configured LinkedIn API Client instance.
 */
function linkedInClient() {
    // LinkedIn OAuth 2 setup
    // TODO: Configure the `linkedin.client_id` and `linkedin.client_secret` Google Cloud environment variables.
    return nodeLinkedin(functions.config().linkedin.client_id, functions.config().linkedin.client_secret, `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com/linkedin-popup.html`);
}
/**
 * Redirects the User to the LinkedIn authentication consent screen. Also the 'state' cookie is set for later state
 * verification.
 */
exports.redirect = functions.https.onRequest((req, res) => {
    const state = crypto.randomBytes(20).toString('hex');
    res.redirect(`https://www.linkedin.com/oauth/v2/authorization` +
        `?response_type=code` +
        `&client_id=${client_id}` +
        `&redirect_uri=${REDIRECT_URI}` +
        `&state=${'abc'}`);
});
/**
 * Exchanges a given LinkedIn auth code passed in the 'code' URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
 * The Firebase custom auth token is sent back in a JSONP callback function with function name defined by the
 * 'callback' query parameter.
 */
exports.token = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const Linkedin = linkedInClient();
    try {
        const form = new FormData();
        form.append('grant_type', 'authorization_code');
        form.append('code', req.query.code);
        form.append('redirect_uri', REDIRECT_URI);
        form.append('client_id', client_id);
        form.append('client_secret', client_secret);
        const results = yield fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            body: form
        });
        console.log('Received Access Token:', results.access_token);
        const linkedin = Linkedin.init(results.access_token);
        return linkedin.people.me((err, userResults) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                throw err;
            }
            console.log('Auth code exchange result received:', userResults);
            // We have a LinkedIn access token and the user identity now.
            const accessToken = results.access_token;
            const linkedInUserID = userResults.id;
            const profilePic = userResults.pictureUrl;
            const userName = userResults.formattedName;
            const email = userResults.emailAddress;
            // Create a Firebase account and get the Custom Auth Token.
            yield createFirebaseAccount(linkedInUserID, userName, profilePic, email, accessToken).then(firebaseToken => {
                // Serve an HTML page that signs the user in and updates the user profile.
                return res.json({
                    token: firebaseToken
                });
            });
        }));
    }
    catch (error) {
        return res.json({
            error: error.toString
        });
    }
}));
/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /linkedInAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
function createFirebaseAccount(linkedinID, displayName, photoURL, email, accessToken) {
    // The UID we'll assign to the user.
    const uid = `linkedin:${linkedinID}`;
    // Save the access token tot he Firebase Realtime Database.
    const databaseTask = admin
        .database()
        .ref(`/linkedInAccessToken/${uid}`)
        .set(accessToken);
    // Create or update the user account.
    const userCreationTask = admin
        .auth()
        .updateUser(uid, {
        displayName: displayName,
        photoURL: photoURL,
        email: email,
        emailVerified: true
    })
        .catch(error => {
        // If user does not exists we create it.
        if (error.code === 'auth/user-not-found') {
            return admin.auth().createUser({
                uid: uid,
                displayName: displayName,
                photoURL: photoURL,
                email: email,
                emailVerified: true
            });
        }
        throw error;
    });
    // Wait for all async task to complete then generate and return a custom auth token.
    return Promise.all([userCreationTask, databaseTask])
        .then(() => {
        // Create a Firebase custom auth token.
        return admin.auth().createCustomToken(uid);
    })
        .then(tokenRes => {
        console.log('Created Custom token for UID "', uid, '" Token:', tokenRes);
        return tokenRes;
    });
}
//# sourceMappingURL=linkedin.functions.js.map