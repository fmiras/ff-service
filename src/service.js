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
  const result = await repository.save({
    customerId: customer.customerId,
    features
  })
  return result.nModified !== 0
}

const setFeatures = async customer => {
  const result = await repository.save(customer)
  return result.nModified !== 0
}

const createCustomer = async customer => {
  return repository.save(customer)
}

module.exports = { getFeatures, addFeatures, setFeatures, createCustomer }
