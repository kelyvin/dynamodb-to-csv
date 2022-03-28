const AWS = require('aws-sdk')
const unmarshal = require('dynamodb-marshaler').unmarshal
const Papa = require('papaparse')
const fs = require('fs')

const setupAwsDynamoDB = (program) => {
  const accessKeyId = program['accesskeyid'] || program['accessKeyId']
  const secretAccessKey = program['secretaccesskey'] || program['secretAccessKey']

  let awsConfig = {
    apiVersion: '2012-08-10'
  }

  if (program.envcreds) {
    awsConfig = Object.assign({}, awsConfig, {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    })
  }

  if (program.region) {
    awsConfig.region = program.region
  }

  if (program.endpoint) {
    awsConfig.endpoint = program.endpoint
  }

  if (accessKeyId) {
    awsConfig.accessKeyId = program.accessKeyId
  }

  if (secretAccessKey) {
    awsConfig.secretAccessKey = secretAccessKey
  }

  return new AWS.DynamoDB(awsConfig)
}

module.exports = (program) => {
  const dynamoDB = setupAwsDynamoDB(program)
  const query = {
    TableName: program.table,
    Limit: 1000
  }
  if (program.columns) {
    query.ProjectionExpression = program.columns
  }

  const headers = []
  let unMarshalledArray = []
  let rowCount = 0
  let writeCount = 0

  const unMarshalIntoArray = (items) => {
    if (items.length === 0) return

    items.forEach((row) => {
      const newRow = {}

      // console.log( 'Row: ' + JSON.stringify( row ))
      Object.keys(row).forEach((key) => {
        if (headers.indexOf(key.trim()) === -1) {
          // console.log( 'putting new key ' + key.trim() + ' into headers ' + headers.toString())
          headers.push(key.trim())
        }
        const newValue = unmarshal(row[key])

        if (typeof newValue === 'object') {
          newRow[key] = JSON.stringify(newValue)
        } else {
          newRow[key] = newValue
        }
      })

      unMarshalledArray.push(newRow)
      rowCount++
    })
  }

  const unparseData = (lastEvaluatedKey) => {
    let endData = Papa.unparse({
      fields: [...headers],
      data: unMarshalledArray
    })

    if (writeCount > 0) {
      // remove column names after first write chunk.
      // replacing with \n instead of '' otherwise first like of current chunk get added to first line of last chunk in the csv
      endData = endData.replace(/(.*\r\n)/, '\n')
    }

    if (program.file) {
      // if there is a target file, open a write stream
      const stream = fs.createWriteStream(program.file, { flags: 'a' })
      stream.write(endData)
    } else {
      console.log(endData)
    }
    // Print last evaluated key so process can be continued after stop.
    console.log(lastEvaluatedKey)

    // reset write array. saves memory
    unMarshalledArray = []
    writeCount += rowCount
    rowCount = 0
  }

  const describeTable = () => {
    dynamoDB.describeTable(
      {
        TableName: program.table
      },
      function (err, data) {
        if (!err) {
          console.dir(data.Table)
        } else console.dir(err)
      }
    )
  }

  const scanDynamoDB = (query) => {
    const writeChunk = program.size

    dynamoDB.scan(query, (err, data) => {
      if (!err) {
        unMarshalIntoArray(data.Items) // Print out the subset of results.

        if (data.LastEvaluatedKey) {
          // Result is incomplete there is more to come.
          query.ExclusiveStartKey = data.LastEvaluatedKey
          if (rowCount >= writeChunk) {
            // once the designated number of items has been read, write out to stream.
            unparseData(data.LastEvaluatedKey)
          }
          scanDynamoDB(query)
        } else {
          unparseData('File Written')
        }
      } else {
        console.dir(err)
      }
    })
  }

  if (program.describe) {
    describeTable()
  } else {
    scanDynamoDB(query)
  }
}
