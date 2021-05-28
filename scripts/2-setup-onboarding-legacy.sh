#!/usr/bin/env bash

if (( $# != 1 ))
then
  echo "USAGE: $0 environments/....json"
  exit 1
fi

newman run --delay-request=100 --environment=$1 ML_OSS_Setup_LegacySim.postman_collection.json
