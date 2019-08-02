# Export DynamoDB to CSV
This project originally started as a fork of [DynamoDBToCSV](https://github.com/edasque/DynamoDBtoCSV), but has since been modified and enhanced to support as both a library and CLI tool with more custom configurations.

This application will export the content of a DynamoDB table into CSV (comma-separated values) output.

## Usage
Before you can run this, you'll need to provide your aws `region`, `accessKeyId`, and `secretAccessKey` either through the CLI arguments or through your library config. If you provide the `-ec` or `--envcreds` cli arguments, it will automatically use the following environment variables to setup the aws config:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

### CLI tool
You can export a CSV by running the CLI via `npx` if you install this module as a dependency:

```bash
$ npm install dynamodbToCsv --save
$ npx dynamodb-to-csv -t Users > users.csv -i "<accesskeyid>" -s "<secretaccesskey>" -r "<region>"
```

Use `-d` to describe the table prior so you can have an idea of the number of rows you are going to export to get some information about the table.

```bash
$ npx -t Users -d --envcreds
```

To see the available options, run the help command:

```
npx dynamodb-to-csv --help
```

### Library
You can also reference it as a library

```bash
$ npm install dynamodb-to-csv --save
```

```javascript
const csvExport = require('dynamodb-to-csv');

// The config options are the same as your CLI options
csvExport({
  table: "Users",
  file: "users.csv",
  region: "<region>"
  accessKeyId: "<accesskeyid>",
  secretAccessKey: "<secretaccesskey>"
})
```

All of your exported CSV's will be exported to the output file name/directory.
