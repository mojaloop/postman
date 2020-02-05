#!/usr/bin/env node

/**
 * @file orderEnvironment
 * @description Use this file to order the values in the Postman environment files
 * @example:
 *   `./scripts/orderEnvironment.js ./environments/Mojaloop-Local.postman_environment.json`
 */


const rootDir = `${__dirname}/..` //This will break if the script is moved out of ./scripts
const filePath = `${process.argv[2]}`
const fs = require('fs')

const environmentFile = require(`${rootDir}/${filePath}`)

// Sort the `values` in the file in a non-case-sensitive manner
environmentFile.values.sort((valA, valB) => {
  const a = valA.key.toLowerCase();
  const b = valB.key.toLowerCase();

  if (a > b) { 
    return 1; 
  }
  if (b > a) {
    return -1; 
  }
  return 0;
})

fs.writeFileSync(`${rootDir}/${filePath}`, Buffer.from(JSON.stringify(environmentFile, null, 2)))