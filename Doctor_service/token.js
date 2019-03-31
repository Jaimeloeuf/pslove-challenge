'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	This token module exposes a verify_token function build upon the jwt module.
*/

// Dependencies
const jwt = require('jsonwebtoken'); // External dependency from NPM by Auth0

// Pass in the verify Options. Options should be the same for every incoming request
// Should move this verifyOption's instantation out of the function to prevent repeated creation
const verifyOption = {
    "aud": "mail", // Audience field will be the name of this service which will be mail service
    "iss": "", // The issuser of this JWT should be the Auth or token service of this service mesh

    // The expiry times and dates will be automatically checked and verified by the verify function call

    // Check the subject of the toke, aka the client, or machine that made this request to this service
}

/*  Verify function is used to read and verify the token sent by client
    The callback is called with the decoded payload if the signature is valid and optional
    expiration, audience, or issuer are valid if given. Else, it will be called with the error.
*/
module.exports.verify = (ctx) =>
    new Promise((resolve, reject) => {
        /* Is the reject method still needed? */
        getToken(ctx) // Get token out of headers into ctx.token property

        // Pass in the JWT from the user, the key used to sign the tokens and a callback function
        jwt.verify(ctx.token, signageKey, (err, decoded_token) => {
            if (err) {
                ctx.setStatusCode(403); // Forbidden
                ctx.newError('Forbidden, invalid auth');
                // if (err === 'invalid audience') // Only true if you add a audience field in the options object
                // ctx.setStatusCode(40??)
                // Error will not be rejected as it is not a code/server/logic error, but a client side error
                return resolve(false); // Since it is a client error, resolve with a 'false'
            }
            else
                ctx.JWT = decoded_token; // After decrypting the token, put data into 'ctx' object for function caller
            return resolve(true); // Resolve with true to indicate verification success
        });
    });

/*  Function to extract token from request header.
    FORMAT OF TOKEN
    Authorization: Bearer <access_token>
*/
function getToken(ctx) {
    ctx.token = ctx.headers['authorization'].split(' ')[1]; // Split at space and Get token from array
    // Check if bearer is undefined
    if (typeof ctx.token === 'undefined') {
        ctx.setStatusCode(401); // If token does not exist or not sent over, respond with a 401 auth-token not provided
        ctx.stop(); // Stop execution if no token given and return faillure to function caller.
    }
}