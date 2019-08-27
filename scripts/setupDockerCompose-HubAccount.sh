#!/usr/bin/env bash

newman run --delay-request=2000 --folder='Hub Account' --environment=environments/Mojaloop-Local-Docker-Compose.postman_environment.json OSS-New-Deployment-FSP-Setup.postman_collection.json
