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

const setFeatures = async customer => {
  const features = await getFeatures(customer.customerId)
  Object.keys(customer.features).forEach(sFeature => {
    features[sFeature] = customer.features[sFeature]
  })
  console.log(features)
  const result = await repository.update({
    customerId: customer.customerId,
    features
  })
  return result
}

module.exports = { getFeatures, setFeatures }
