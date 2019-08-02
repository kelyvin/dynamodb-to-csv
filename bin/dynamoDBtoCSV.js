#!/usr/bin/env node

const dynamoDBtoCSV = require('../dynamoDBtoCSV')
const program = require('commander')

program
  .version('0.0.1')
  .option('-t, --table [tablename]', 'Add the table you want to output to csv')
  .option('-d, --describe')
  .option('-r, --region [regionname]', 'The AWS region')
  .option('-i, --accesskeyid [accessKeyId]', 'The AWS access key id')
  .option('-s, --secretaccesskey [secretAccessKey]', 'The AWS secret access key')
  .option('-e, --endpoint [url]', 'Endpoint URL, can be used to export from local DynamoDB')
  .option('-f, --file [file]', 'Name of the file to be created')
  .option('-fs, --size [size]', 'Number of lines to read before writing.', 5000)
  .option('-ec, --envcreds', 'Will use environment variables instead for the AWS config')
  .parse(process.argv)

if (!program.table) {
  console.log('You must specify a table')
  program.outputHelp()
  process.exit(1)
}

dynamoDBtoCSV(program)
