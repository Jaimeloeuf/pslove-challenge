'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc Module description:
	This module is a wrapper over the 'jsonwebtoken' package to create/read/sign/verify a token

    @TODO
    - Create 1 Function to extract JWTs from header or token automatically.
    - Add a function to coerce Auth header to either all lower or upper case (No need if using Express)
    - Write unit test for this module
	- look into private Keys and stuff like Asymmetric signing and verifying
	- Create child processes too, to deal with the parsing and signing as it seems like it
      will take quite abit of CPU power
    - Start implementing JWEs
    - Perhaps the Public/Private key pair should be generated at a interval to change it constantly.

    Edit this module so that the keys are only generated and applied in if this is used by
    the signing authority.
    For services that just verify, they should be able to specify to not run those stuff.
*/

// Dependencies
const jwt = require('jsonwebtoken'); // External dependency from NPM by Auth0
const { promisify } = require('util');

// Using the promisify method from the util module, Promisify the original jwt methods
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);


// Curried function of the original Promisified sign method
var create_token = (private_key) => (signOption) => (payload) => sign(payload, private_key, signOption);

// Curried function of the original Promisified verify method
var verify_token = (public_key) => (verifyOption) => (token) => verify(token, public_key, verifyOption);


// Function to generate the Public/Private key pairs.
function generateKeys() {
    // Import and cache in memory only when used to generate keys. Garbage collected when function ends
    const { generateKeyPairSync } = require('crypto');

    // Generate a key with the RS256 algorithm.
    return generateKeyPairSync('rsa', {
        modulusLength: 1024, // Can be changed to be longer like 4096 for added security
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
}


// Function to apply keys to curried functions for partial applications with keys in their closures
function apply_keys() {
    const { publicKey, privateKey } = generateKeys();

    /*  Partial application with the private key for Signing in its closure.
        Resolves with the signed JWT, else
        Rejects with an error.  */
    create_token = create_token(privateKey);

    /*  Partial application with the public key for verification in its closure.
        If signature is valid and the optional expiration, audience, or issuer are valid if given
        Resolves with the decoded token, else
        Rejects with an error.  */
    verify_token = verify_token(publicKey);

    // Return the public key for other services to use for verification, but let privateKey
    // be destroyed when this function ends, to prevent it from being shared or anything
    return publicKey;
}

// Apply keys into closures of the sign and verify functions and get back publicKey for verification
const publicKey = apply_keys();


/*  Pure function to extract token from request header and returns it
    FORMAT OF TOKEN --> Authorization: Bearer <access_token>
    Split on space, get token from array and return it.
    Express automatically coerces keys in the header object to be lowercase. */
// Only for services where the JWT is passed in the Auth HTTP header
const extract_jwt_in_header = (req) => req.headers['authorization'].split(' ')[1];

// Only for web-apps where the JWT is passed as a cookie
const extract_jwt_in_cookie = (req) => req.cookies.jwt;
// Function for extracting CSRF token from the request from a web-app client
const extract_CSRF_token = (req) => req.headers['x-csrf-token'];


module.exports = {
    // The 2 promisified methods, Promisified with the Promisfy Util.
    sign,
    verify,

    // JWT and CSRF token extraction methods
    extract_jwt_in_header,
    extract_jwt_in_cookie,
    extract_CSRF_token,

    // The 2 curried versions for token signing and verification with the key in their closures
    create_token,
    verify_token,

    // getPublicKey is exported for other modules/services to get latest public key to verify the JWT
    getPublicKey: () => publicKey
}


/*	Docs and Notes:

    What should a JWT contain?   (Client holding the JWT will be referred to as the owner)
	- The owner's Identity, basically declaring who the user is
	- What are the resources that the owner can access.
	- Who issused the JWT token to the user
	- And who is the JWT intended for? Meaning who or which microservice should accept the token?
	standard token
	headers:
		{
			"typ": "JWT",
			"alg": "HS256" // The algorithm used for the signature is HMAC SHA-256
		}
		{
			// Who this person is (sub, short for subject)
			// What this person can access with this token (scope)
			// When the token expires (exp)
			// Who issued the token (iss, short for issuer)
			// These below declarations are known as Claims, because the token creator claims a set of assertions that can be used to ‘know’ things about the subject. Because the token is signed with a secret key, you can verify its signature and implicitly trust what is claimed.
			"exp": ,
			"iat": ,
			"expiresIn": ,
			"tokenType": "Bearer",
			"sub":
			"subject": "retrieve data", // What is the purpose of this token/request?
			"usrID": 578ec9,
			"usr": "john@gmail.com",
			"iss": "bouk.com", // Issuer of the token
			"aud": "bouk.com/", // Intended audience that should acccept the token
			"account type": "consumer", // The type of account that the user has
			"roles": {
				// The things/roles that the user is allowed to do
				"role": "consumer"
				"booking": "create"
			}
			"scope": ["read", "write", "update", "del"]
        }

    JWTs are used for stateless Auth and in a stateless request
    meaning that it should contain all and just enough data to make the request valid and enough
    for generating the response back
    Do not put too much claims or data into the JWT. Only what is needed

    the payload will say what is the token used for. E.g. identity token / information token...
*/