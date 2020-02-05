#!/usr/bin/env node

/**
 * @file orderEnvironment
 * @description Use this file to order the values in the Postman environment files
 * @example:
 *   `./scripts/orderEnvironment.js ./environments/Mojaloop-Local.postman_environment.json`
 */

// TODO: figure out a better path...
const filePath = `../${process.argv[2]}`
const fs = require('fs')

const environmentFile = require(filePath)

// Sort the `values` in the file in a non-case-sensitive manner
environmentFile.values.sort((valA, valB) => {
  a = valA.key.toLowerCase();
  b = valB.key.toLowerCase();

  if (a > b) { 
    return 1; 
  }
  if (b > a) {
    return -1; 
  }
  return 0;
})

fs.writeFileSync('./test.json', Buffer.from(JSON.stringify(environmentFile, null, 2)))