const { MongoClient } = require('mongodb')

const { MONGO_URL, MONGO_DB } = process.env

const find = async query => {
  const connection = await MongoClient.connect(MONGO_URL)
  const db = connection.db(MONGO_DB)
  const collection = db.collection('customers')
  console.debug(`Querying: ${JSON.stringify(query)}`)
  const result = await collection.findOne(query)
  console.debug(
    `Result for Query ${JSON.stringify(query)} is ${JSON.stringify(result)}`
  )
  return result.features
}

module.exports = { find }
