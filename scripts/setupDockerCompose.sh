#!/usr/bin/env bash

echo "-== Creating Hub Accounts ==-"
sh ./scripts/setupDockerCompose-HubAccount.sh

echo "-== Onboarding PayerFSP ==-"
sh ./scripts/setupDockerCompose-PayerFSP.sh

echo "-== Onboarding PayeeFSP ==-"
sh ./scripts/setupDockerCompose-PayeeFSP.sh
