#!/usr/bin/env node

var dynamoDBtoCSV = require("../dynamoDBtoCSV")
var program = require("commander");

program
  .version("0.0.1")
  .option("-t, --table [tablename]", "Add the table you want to output to csv")
  .option("-d, --describe")
  .option("-r, --region [regionname]")
  .option(
    "-e, --endpoint [url]",
    "Endpoint URL, can be used to dump from local DynamoDB"
  )
  .option("-p, --profile [profile]", "Use profile from your credentials file")
  .option("-f, --file [file]", "Name of the file to be created")
  .option(
    "-ec --envcreds",
    "Load AWS Credentials using AWS Credential Provider Chain"
  )
  .option("-s, --size [size]", "Number of lines to read before writing.", 5000)
  .parse(process.argv);

if (!program.table) {
  console.log("You must specify a table");
  program.outputHelp();
  process.exit(1);
}

dynamoDBtoCSV(program)
