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
  const result = await repository.update({
    customerId: customer.customerId,
    features
  })
  return result.nModified !== 0
}

const setFeatures = async customer => {
  const result = await repository.update(customer)
  return result.nModified !== 0
}

module.exports = { getFeatures, addFeatures, setFeatures }
