'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	This token module exposes a verify_token function build upon the jwt module.
*/

// Dependencies
const { verify_token } = require('./jwt'); // External dependency from NPM by Auth0

const verifyOption = {
    "aud": "mail", // Audience field will be the name of this service which will be mail service
    "iss": "auth", // The issuser of this JWT should be the Auth or token service of this service mesh

    // The expiry times and dates will be automatically checked and verified by the verify function call
    // Check the subject of the toke, aka the client, or machine that made this request to this service
}

// Apply the verifyOption in to get back a final function that is able to verify tokens.
verify_token = verify_token(publicKey)(verifyOption); // To get the public key from the Auth service

// This is a middleware function that can be used on routes that require JWT security
function get_token(req, res, next) {
    // Save token for subsequent functions to access token with request object after this middleware
    req.token = extract_jwt_in_header(req);
    // End the req/res cycle if no token is sent
    if (typeof req.token === 'undefined')
        res.status(401).end(''); // If token does not exist or not sent over, respond with a 401 auth-token not provided
    // ^To update the response message, either with a 401 HTML page or smth

    // Call the next middleware in the chain
    next();
}

module.exports = {
    verify_token,
    get_token
}