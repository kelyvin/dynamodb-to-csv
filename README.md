# AWS DynamoDBtoCSV

[![Join the chat at https://gitter.im/edasque/DynamoDBtoCSV](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/edasque/DynamoDBtoCSV?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This application will export the content of a DynamoDB table into CSV (comma-separated values) output. All you need to do is update `config.json` with your AWS credentials and region.

The output is comma-separated and each field is enclosed by double quotes ("). Double quotes in the data as escaped as \"

This software is governed by the Apache 2.0 license.

## Usage

### CLI tool
You can export a CSV by running the CLI via `npx` if you install this module as a dependency:

```bash
$ npm install dynamoDBtoCSV --save
$ npx dynamoDBtoCSV -t Hourly_ZEDO_Impressions_by_IP > output.csv
```

Or you can run the CLI after cloning the repo like so:

```bash
$ git clone https://github.com/chriskinsman/DynamoDbExportCsv.git
$ cd DynamoDbExportCsv
$ node bin/dynamoDBtoCSV.js -t Hourly_ZEDO_Impressions_by_IP > output.csv
```

or even:

```bash
$ node bin/dynamoDBtoCSV.js -t Hourly_ZEDO_Impressions_by_IP -f output.csv
```

Use _-d_ to describe the table prior so you can have an idea of the number of rows you are going to export to get some information about the table.

```bash
$ node bin/dynamoDBtoCSV.js -t Hourly_ZEDO_Impressions_by_IP -d
```

Full syntax is:

```
node dynamoDBtoCSV.js --help
  Usage: dynamoDBtoCSV.js [options]

Options:

  -h, --help               output usage information
  -V, --version            output the version number
  -t, --table [tablename]  Add the table you want to output to csv
  -e, --endpoint [url]     Endpoint URL, can be used to dump from local DynamoDB
  -f, --file [file]        Name of the file to be created
  -d, --describe
  -p, --profile [profile]  Use profile from your credentials file
  -ec --envcreds           Load AWS Credentials using AWS Credential Provider Chain
```

### Library
You can also reference it as a library

```bash
$ npm install dynamoDBtoCSV --save
```

```javascript
var csvExport = require('dynamoDBtoCSV');

// The config options are the same as your CLI options
csvExport({
  table: "Hourly_ZEDO_Impressions_by_IP",
  file: "output.csv"
})
```

## Pre-requisites

You'll need to install a few modules, including:

- aws-sdk
- commander
- dynamodb-marshaler
- papaparse

npm install

should do it.

## Example output

    "HashOf10","DateIPAdID","adcount"
    "37693cfc748049e45d87b8c7d8b9aacd","2013011720024058205168000000010002","1"
    "37693cfc748049e45d87b8c7d8b9aacd","2013011720050084232194000000010002","1"
