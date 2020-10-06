# Postman Collections for Mojaloop
[![Git Commit](https://img.shields.io/github/last-commit/mojaloop/postman.svg?style=flat)](https://github.com/mojaloop/postman/commits/master)
[![Git Releases](https://img.shields.io/github/release/mojaloop/postman.svg?style=flat)](https://github.com/mojaloop/postman/releases)
<!-- [![CircleCI](https://circleci.com/gh/mojaloop/postman.svg?style=svg)](https://app.circleci.com/pipelines/github/mojaloop/postman) -->

[Postman](https://www.postman.com/) is a UI and CLI based API Development tool. The Mojaloop Community uses Postman for writing and running End to End tests.


## Contents
- [1. Collections](#1-collections)
- [2. Environments](#2-environments)
- [3. Testing](#3-testing)
- [4. Support Scripts for Docker-compose](#4-support-scripts-for-docker-compose)
    - [4.1 Prerequisites](#41-prerequisites)
    - [4.2 Pre-loading Test Data](#42-pre-loading-test-data)
    - [4.3 Running Example Requests](#43-running-example-requests)
- [5. Tools + Utils](#5-tools--utils)

## 1. Collections

> **Note:** *Make sure to always check the [Helm Release Notes](https://github.com/mojaloop/helm/releases) for the postman collection you should be using for your given deployment version.*

Postman Collections are sets of organized API calls, which can either be run one at a time, or en masse using the [Postman Collection Runner](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/)

While this repo contains a number of different Postman Collections for the various testing needs of the community - the most important collections for getting your Mojaloop deployment up and running are below:

If the environment is configured to use Mojaloop Simulator, these collections need to be used, in that order.

- [MojaloopHub_Setup.postman_collection.json](MojaloopHub_Setup.postman_collection.json)
- [MojaloopSims_Onboarding.postman_collection.json](MojaloopSims_Onboarding.postman_collection.json)
- [Golden_Path_Mojaloop.postman_collection.json](Golden_Path_Mojaloop.postman_collection.json)


### 1.1 MojaloopHub_Setup

`MojaloopHub_Setup` sets up an empty Mojaloop hub, including things such as the Hub's currency, the settlement accounts.

### 1.2 MojaloopSims_Onboarding

`MojaloopSims_Onboarding` sets up the DFSP simulators, and configures things such as the endpoint urls so that the Mojaloop hub knows where to send request callbacks.

### 1.3 Golden_Path_Mojaloop

The `Golden_Path_Mojaloop` collection is an end-to-end regression test pack which does a complete test of all the deployed functionality. This test can be run manually but is actually designed to be run from the start, in an automated fashion, right through to the end, as response values are being passed from one request to the next.

> ***Note:** *As of `mojaloop/helm:v10.1.0` We have enabled users to configure the deployment to use either the Legacy Simulators or the new Mojaloop Simulators. See [Helm Release Notes](https://github.com/mojaloop/helm/releases) for more information depending on your `mojaloop/helm` version. If you are deploying with the legacy simulators, then you will want to use [ML_OSS_Setup_LegacySim](ML_OSS_Setup_LegacySim.postman_collection.json) for the DFSP setup and [ML_OSS_Golden_Path_LegacySim](ML_OSS_Golden_Path_LegacySim.postman_collection.json) for the golden path tests, instead.


## 2. Environments

A postman environment contains the environment variables that are required by the various collections. You can customize an Environment to suit your deployment needs. 

This repository maintains the following environment files:
- [Local Development](./environments/Mojaloop-Local.postman_environment.json) - Configuration for local development
- [Local Docker-Compose](./environments/Mojaloop-Local-Docker-Compose.postman_environment.json) - Configuration for a docker-compose based Mojaloop installation


### 2.1 Customizing the an Environment for your needs

Most of the environment variables will be what you need out of the box, but the main configuration we find deployers needing to do is around the Endpoint configuration. 

For example, the variable `HOST_ACCOUNT_LOOKUP_ADMIN`:

```json
{
  "key": "HOST_ACCOUNT_LOOKUP_ADMIN",
  "value": "http://account-lookup-service-admin.local",
  "enabled": true
},
```

Is the base url that Postman uses to communicate with the [`mojaloop/account-lookup-service`]()


2 Major things that will change this configuration will be:

1. Your ingress settings on the Mojaloop Deployment. If you have changed the ingress settings in your Helm [`values.yml`](https://github.com/mojaloop/helm/blob/master/mojaloop/values.yaml) file, you will need to change this environment variable to reflect 
2. Your `/etc/hosts` configuration. See the [deployment guide](https://docs.mojaloop.io/documentation/deployment-guide/#52-verifying-mojaloop-deployment) for how we use the `/etc/hosts` file to redirect hosts such as `account-lookup-service-admin.local` to point to a local or remote Mojaloop hub.


## 3. Testing

The collections can be run as they are via Postman but for a more detailed setup of a complete stand-alone test environment (QA and Regression Testing Framework) please refer to the detailed explanation in the Mojaloop documentation  [here](https://docs.mojaloop.io/documentation/contributors-guide/tools-and-technologies/automated-testing.html "Automated Testing")


## 4. Support Scripts for Docker-compose
Script folder contains support docker-compose scripts that are to be used in conjunction with the Mojaloop Components (e.g. [ml-api-adapter](https://github.com/mojaloop/central-ledger), [central-ledger](https://github.com/mojaloop/central-ledger)).

Refer to their respective onboarding guide for more information.

### 4.1 Prerequisites

Install [Postman CLI Newman](https://learning.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman):

> Ensure that you have [NPM installed](https://www.npmjs.com/get-npm).
```bash
# Install newman
npm install -g newman
```

### 4.2 Pre-loading Test Data

>Note: Ensure that you execute the following commands in your project folder after running `npm install`.
>Note: Ensure that you are in the project root folder

#### 4.2.1 Hub Account

```bash
sh scripts/setupDockerCompose-HubAccount.sh
```

Or alternatively use newman directly...

```bash
# Newman command to pre-load the default Hub Account
newman run --delay-request=2000 --folder='Hub Account' --environment=environments/Mojaloop-Local-Docker-Compose.postman_environment.json OSS-New-Deployment-FSP-Setup.postman_collection.json
```

Example output:

```bash
OSS-New-Deployment-FSP-Setup

❏ Hub Account
↳ Add Hub Account-HUB_MULTILATERAL_SETTLEMENT
  POST http://central-ledger.local:3001/participants/Hub/accounts [201 Created, 511B, 5.4s]
  
  ...continued...
```

#### 4.2.2 Onboard PayerFSP

```bash
sh scripts/setupDockerCompose-PayerFSP.sh
```

Or alternatively use newman directly...

```bash
# Newman command to pre-load payerfsp data
newman run --delay-request=2000 --folder='payerfsp (p2p transfers)' --environment=environments/Mojaloop-Local-Docker-Compose.postman_environment.json OSS-New-Deployment-FSP-Setup.postman_collection.json
```

Example output:

```bash
OSS-New-Deployment-FSP-Setup

❏ FSP Onboarding / payerfsp (p2p transfers)
↳ Add payerfsp - TRANSFERS
  POST http://central-ledger.local:3001/participants [201 Created, 642B, 5.1s]
  ✓  Status code is 201
  
  ...continued...
```

#### 4.2.3 Onboard PayeeFSP

```bash
sh scripts/setupDockerCompose-PayeeFSP.sh
```

Or alternatively use newman directly...

```bash
# Newman command to pre-load payeefsp data
newman run --delay-request=2000 --folder='payeefsp (p2p transfers)' --environment=environments/Mojaloop-Local-Docker-Compose.postman_environment.json OSS-New-Deployment-FSP-Setup.postman_collection.json
```

Example output:

```bash
OSS-New-Deployment-FSP-Setup

❏ FSP Onboarding / payeefsp (p2p transfers)
↳ Add payeefsp - TRANSFERS
  POST http://central-ledger.local:3001/participants [201 Created, 642B, 5s]
  ✓  Status code is 201
  
  ...continued...
```

### 4.3 Running Example Requests

1. Import the [Golden Path](./Golden_Path.postman_collection.json) Collection and [Docker-compose Environment](./environments/Mojaloop-Local-Docker-Compose.postman_environment.json) File.
    - Postman Environment: `./environments/Mojaloop-Local-Docker-Compose.postman_environment.json`
    - Postman Collection: `./Golden_Path.postman_collection.json`
2. Ensure you select `Mojaloop-Local-Docker-Compose` from the environment drop-down
3. Navigate to `Golden_Path` > `p2p_money_transfer` > `p2p_happy_path SEND Quote` > `Send Transfer`
4. Click **Send**
5. You can check the logs, database, etc to see the transfer state, status changes, positions and other such information.


## 5. Tools + Utils

### orderEnvironment

Annoyingly, when exporting Postman environments, there is no ordering done of the key names, which means managing 100+ environment settings gets really taxing.

You can use the `orderEnvironment.js` script to do this ordering for you, after exporting your environment files.

For example:

```bash
./scripts/orderEnvironment.js ./environments/Mojaloop-Local.postman_environment.json
```

This little step will make using Postman just that bit easier...

### To compare two postman environments

You can use the script `postman-environments-compare.js` to compare two postman environment files by each key.

Usage: node postman-environments-compare.js <first-file> <second-file>

The script can return the following
- Items those exist only in first file
- Items those exist only in second file
- Items those exist in both files
- Items which are common but with different values
