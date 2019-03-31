'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	Server app instance module that handles incoming email sending requests from other services
    
    @Todo
    - Modify the service to work around a mail queue.
*/


const express = require('express');
const app = express();
const send_mail = require('./mail').send;
const { port } = require('./config');
const { print, error } = require('./utils');
// Finalhandler module to deal with responding back to the client and closing the connection


// verify if the client is a service with the JWT
async function service_identity_checker(req, res, next) {
    try {
        const token = await verify(req.token);

        // Check if the service field is true
        if (token.service)
            next(); // Call next middleware to execute
        else
            res.status(403).end(JSON.stringify({ ERR: 'Forbidden route' })); // Set status code and end HTTP cycle
    } catch (err) {
        // Log the error to the error log for analytics

        res.status(401).end(JSON.stringify({ ERR: 'Token Needed' })); // Set status code and end the HTTP cycle.
    }
}

/*  @Flow
    - Extract token out from request header and attach directly to request object's token property
    - Verify that the JWT signature is valid
    - Check the identity of the client as stated in the JWT to make sure client is an approved service
    - Accept and read the HTTP message body posted from the client
    - Send the mail as specified by the request body (Only this is done in the anoynymous function)

    @Todos
    - Add a POST body size limit to the bodyParser
    - Take in an optional request on the url for email service to respond back when the service is performed
*/
app.post('/send', get_token, service_identity_checker, express.json(), (req, res) => {
    // Request body is the JSON string parsed by express.json() for send_mail function
    send_mail(req.body);
    // End the HTTP req/res cycle after call to send_mail function
    res.end();
});

// Ping Route to check server status
app.get('/ping', (req, res) => res.status(200).end());

// 404 route handler
app.use((req, res, next) => {
    res.status(404).send("ERR 404: Cannot find requested resource");
});

// 500 internal server error route handler
app.use((err, req, res, next) => {
    // Log trace stack and error to the console
    error(err.stack);
    res.status(500).send('ERR 500: Internal server error');
});

app.listen(port, () => print(`Server listening to port ${port}`));