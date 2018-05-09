const { MongoClient } = require('mongodb')

const { MONGO_URL, MONGO_DB } = process.env

const clearCache = (customerId, db) => {
  const collection = db.collection('responses')
  return collection.remove({ data: { customerId } })
}

const find = async query => {
  const connection = await MongoClient.connect(MONGO_URL)
  const db = connection.db(MONGO_DB)
  const collection = db.collection('customers')
  console.debug(`Find Querying: ${JSON.stringify(query)}`)
  const result = await collection.findOne(query)
  console.debug(
    `Result for Query ${JSON.stringify(query)} is ${JSON.stringify(result)}`
  )
  connection.close()
  return result.features
}

const save = async ({ customerId, features }) => {
  const connection = await MongoClient.connect(MONGO_URL)
  const db = connection.db(MONGO_DB)
  const collection = db.collection('customers')
  let result
  if (customerId) {
    result = await collection.update(
      { customerId },
      { $set: { features } },
      { upsert: true }
    )
  } else {
    const last = await collection.findOne(
      {},
      { sort: [['customerId', 'desc']] }
    )
    result = await collection.insert({
      customerId: last.customerId + 1,
      features
    })
  }
  await clearCache(result.customerId, db)
  connection.close()
  return result
}

module.exports = { find, save }
