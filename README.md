# Postman collections for Mojaloop

- Github [Repo link](https://github.com/mojaloop/postman)


## 1. Collections
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


## 2. Environments
Import the Environment Config and make rhe required changes to reflect the correct endpoints to the mojaloop deployment required to be tested. This environemt file contains all the required variables and placeholders needed by all the collections, but the examples for endpoints provided, point to a local mojaloop installation with the standard Ingress exposed local endpoints:
- [Local Development](./environments/Mojaloop-Local.postman_environment.json)


## 3. Testing
The collections can be run as they are via Postman but for a more detailed setup of a complete stand-alone test environment (QA and Regression Testing Framework) please refer to the detailed explanation in the Mojaloop documentation  [here](https://github.com/mojaloop/documentation/blob/master/contributors-guide/tools-and-technologies/automated-testing.md "Automated Testing")


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

## 5. Running inside a locally deployed Kubernetes cluster of Mojaloop
The available docker image can be used in order to deploy the tests inside a running local K8s cluster as a standalone `pod`, by using a `pod.yaml` file like the following example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: postman
spec:
  containers:
    - name: postman-tests
      image: mojaloop/postman
      command: ["/bin/sh"]
      args: ["-c", "newman run Golden_Path.postman_collection.json \
      -e environments/Mojaloop-Local.postman_environment.json \
      --env-var HOST_QUOTING_SERVICE='foo' \
      --env-var HOST_CENTRAL_LEDGER='bar' \
      --bail"]
  restartPolicy: Never
```

and pushing it inside the K8s cluster with a command like:
```shell script
kubectl create -f ./pod.yaml
```

The command (in the part `args` of the above yaml definition) could be changed to whatever suits the needs of the user and the logs of it can be viewed by running:

```shell script
kubectl logs postman-tests
```

The `pod` can be deleted with:
```shell script
kubectl delete -f ./pod.yaml
```
or
```shell script
kubectl delete pods postman-tests
```