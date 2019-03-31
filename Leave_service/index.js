'use strict'; // Enforce use of strict verion of JavaScript

/*	@Doc
	Server app instance module that sends leave request emails to the HR
    
    @Todo
    - Modify the service to work around a mail queue.
*/


const express = require('express');
const app = express();
const https = require('https');
const { port } = require('./config');
const { print, error } = require('./utils');
// Finalhandler module to deal with responding back to the client and closing the connection


// Route to post to the mail service to send a email to HT to request for leave
app.post('/request-leave', get_token, express.json(), (req, res) => {
    // Add the HR email into the HTTP message body for sending the mail
    req.body.recepient = req.body.HR_email;

    // Add the username in as the patient
    req.body.patient = req.body.user.username;

    /* Add more stuff here to craft the email as needed. */

    // Make post request, when response received, end the cycle.
    https.post('https://api.pslove.com/sendmail', req.body, (resp) => req.end());
});

// Route to send email with MC as attachment to HR
app.post('/send-mc', get_token, express.json(), (req, res) => {
    // Add the HR email into the HTTP message body for sending the mail
    req.body.recepient = req.body.HR_email;
    
    // Add the username in as the patient
    req.body.patient = req.body.user.username;

    // Add MC as attachment
    req.body.attachment.MC = req.body.MC;

    /* Add more stuff here to craft the email as needed. */

    // Make post request, when response received, end the cycle.
    https.post('https://api.pslove.com/sendmail', req.body, (resp) => req.end());
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