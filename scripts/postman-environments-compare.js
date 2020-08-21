/**
 * @file postman-environments-compare.js
 * @description Use this file to compare the keys and values in two Postman environment files
 * @example:
 *   `node postman-environments-compare.js <first-file> <second-file>`
 */

const fs = require('fs');
const { exit } = require('process');
var myArgs = process.argv.slice(2);

if (myArgs.length !== 2) {
    console.log('Usage: node postman-environments-compare.js <first-file> <second-file>\n')
    exit(1) 
}

const env1 = fs.readFileSync(myArgs[0])
const env2 = fs.readFileSync(myArgs[1])
let env1Json = JSON.parse(env1)
let env2Json = JSON.parse(env2)

const onlyInEnv1 = env1Json.values.filter(item1 => {
    return env2Json.values.find(item2 => item1.key === item2.key) === undefined
})

const onlyInEnv2 = env2Json.values.filter(item2 => {
    return env1Json.values.find(item1 => item2.key === item1.key) === undefined
})

const commonKeys = env1Json.values.filter(item1 => {
    return env2Json.values.find(item2 => item1.key === item2.key)
})

const commonKeysWithDifferentValues = env1Json.values.filter(item1 => {
    return env2Json.values.find(item2 => (item1.key === item2.key) && (item1.value !== item2.value))
})

console.log('Items those exist only in first file', JSON.stringify(onlyInEnv1.map(item => item.key), null, 2))
console.log('Items those exist only in second file', JSON.stringify(onlyInEnv2.map(item => item.key), null ,2))
console.log('Items those exist in both files', JSON.stringify(commonKeys.map(item => item.key), null, 2))

const commonKeysWithDifferentValuesComparison = commonKeysWithDifferentValues.map(item => {
    return {
        'key': item.key,
        'value1': item.value,
        'value2': env2Json.values.find(item2 => item2.key === item.key).value
    }
})

console.log('Items which are common but with different values', JSON.stringify(commonKeysWithDifferentValuesComparison, null, 2) )
