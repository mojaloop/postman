# Postman collections for Mojaloop

- Github [Repo link](https://github.com/mojaloop/postman)

## Collections
There are 4 Postman Collections in the repository:
- OSS-New-Deployment-FSP-Setup.postman_collection
- Golden_Path.postman_collection
- OSS-API-Tests.postman_collection
- OSS-Feature-Tests.postman_collection

The first collection that needs to be run, in order to set up the database after a clean install, is OSS-New-Deployment-FSP-Setup. The sequence in which you can run the other collections after that is not important, it really depends on the type of test required.

The Golden_Path is an end-to-end regression test pack which does a complete test of all the deployed functionality. This test can be run manually but is actually designed to be run from the start, in an automated fashion, right through to the end, as response values are being passed from one request to the next.

OSS-API-Tests is a more ad-hoc and manual test pack where any request can be run to test a particular API.

OSS-Feature-Tests contains tests which isolates individual features to be tested and by implication spans one or more APIs at a time.

Import the Collections into your Postman Client:
- [OSS-New-Deployment-FSP-Setup](OSS-New-Deployment-FSP-Setup.postman_collection.json)
- [Golden_Path](Golden_Path.postman_collection.json)
- [OSS-API-Tests](OSS-API-Tests.postman_collection)
- [OSS-Feature-Tests](OSS-Feature-Tests.postman_collection)

## Environments
Import the Environment Config and make rhe required changes to reflect the correct endpoints to the mojaloop deployment required to be tested. This environemt file contains all the required variables and placeholders needed by all the collections, but the examples for endpoints provided, point to a local mojaloop installation with the standard Ingress exposed local endpoints:
- [Local Development](./environments/Mojaloop-Local.postman_environment.json)

## Testing
The collections can be run as they are via Postman but for a more detailed setup of a complete stand-alone test environment (QA and Regression Testing Framework) please refer to the detailed explanation in the Mojaloop documentation  [here](https://github.com/mojaloop/documentation/blob/master/contributors-guide/tools-and-technologies/automated-testing.md "Automated Testing")

## Support Scripts for Docker-compose
Script folder contains support docker-compose scripts that are to be used in conjunction with the Mojaloop Components (e.g. [ml-api-adapter](https://github.com/mojaloop/central-ledger), [central-ledger](https://github.com/mojaloop/central-ledger)).

Refer to their respective onboarding guide for more information.

Install [Postman CLI Newman](https://learning.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman):

**Prerequisites**
> Ensure that you have NPM installed.
```bash
# Install newman
npm install -g newman
```
