'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	Config.js is a Module used to create and export configuration variables,
	and allow users to use variables read from the envrionmental variables.
*/

module.exports.mail_config = {
    // For now service is fixed
    service: "gmail",

    // Read the username and password for email authentication
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
}

// See if any additional acceptable environmental variables injected, Overwrite existing defaults if available.
module.exports.port = process.env.port || 80;