'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	This module provides utiliy functions to the other modules.
*/

/* Utilities function bindings */
module.exports.print = console.log;
module.exports.error = console.error;
module.exports.write = process.stdout.write;

// Wrapper function over JSON.stringify to catch potential errors with a try/catch block
module.exports.JSON_string = function (object) {
	try {
		return JSON.stringify(object);
	} catch (err) { error(err); } // Log errors if any and continue
}