# API Services
- Auth/Token Service:
    - Owns the User Database
    - In charge of authentication/user-login and token provisioning.

- Email Service:
    - Used for email notification and authentication (2FA) actions.

- Leave Service:
    - Upstream service of Email service to notif HR through Email of leave

- Doctor service
    - Upstream service to send a email to the Doctor to request for MC and consultation.

- EComm Serice
    - Service that provides real time product recommendations for the patient/user depending on the pain level and or point in the menstrual cycle.
    - Recommendation engine to be built with data from [data analysis](https://github.com/sanchitmittl/pslove)

Read more about the services in their respective README files in their directories.

## How to run everything.
- Using the docker-compose.yaml file in this directory, use docker-compose to spin up all the services and establish connections between them.
- Alternatively, all the services have their own dockerfiles in their own directories, to build their images to run seperately.
- If images built and ran independantly, you would need to manually provide the port connections to them via environmental variables.