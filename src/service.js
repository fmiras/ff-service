const repository = require('./repository')

const getFeatures = async (customerId, requestedFeaturesNames) => {
  const features = await repository.find({ customerId })
  if (!requestedFeaturesNames) {
    return features
  }

  const result = {}
  requestedFeaturesNames.forEach(featureName => {
    result[featureName] = features[featureName] || false
  })
  return result
}

const addFeatures = async customer => {
  const features = await getFeatures(customer.customerId)
  Object.keys(customer.features).forEach(sFeature => {
    features[sFeature] = customer.features[sFeature]
  })

  const newCustomer = {
    customerId: customer.customerId,
    features
  }

  const result = await repository.save(newCustomer)

  if (result.nModified !== 0) {
    return newCustomer
  }

  throw new Error(
    `There was a problem updating the customer ${
      newCustomer.customerId
    } features`
  )
}

const setFeatures = async customer => {
  const result = await repository.save(customer)
  if (result.nModified !== 0) {
    return customer
  }

  throw new Error(
    `There was a problem updating the customer ${customer.customerId} features`
  )
}

const createCustomer = async customer => {
  const { ops } = await repository.save(customer)
  return {
    customerId: ops[0].customerId,
    features: ops[0].features
  }
}

module.exports = { getFeatures, addFeatures, setFeatures, createCustomer }
