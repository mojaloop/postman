#!/usr/bin/env bash

if (( $# != 1 ))
then
  echo "USAGE: $0 environments/....json"
  exit 1
fi

echo "-== Creating Hub Accounts ==-"
sh ./scripts/setup-HubAccount.sh $1

echo "-== Onboarding PayerFSP ==-"
sh ./scripts/setup-PayerFSP.sh $1

echo "-== Onboarding PayeeFSP ==-"
sh ./scripts/setup-PayeeFSP.sh $1
