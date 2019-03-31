# README for Email service

- Email Service is just a basic mail service implementation designed to send emails at the request of other services. This will be used as a down stream service of the Doctor and/or leave service.
- The Services that are allowed to use this email service should either be pre-defined in the application code or read from a service registry if there is one.

- Using the RESTful HTTP service to service interaction method
    1. Receive a email request.
    2. Sends out the email per the request
    3. If email successfully sent, response to service invocation with 200 OK, else response with either 400 failed or 500 service server failed

- Using a Event Driven service interaction model
    1. Service that wants to send out a email, creates an event and notifies the event bus/broker
    2. The email service is a consumer of the email request events, will send out the email per the request and record last position of the request commit log
    3. If email successfully sent, an email request successful event is created, which can be consumed by the services which made the requests
        - In the event of a crash, the service will
            - View the last completed email request, and follow on from there. (By following the last position of the kafka log)

- Email service is used to handle requests from other services to use email users
- This service is meant only for use by approved services. Services must provide valid auth to use this service.