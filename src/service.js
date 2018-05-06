const repository = require('./repository')

module.exports = async (customerId, requestedFeaturesNames) => {
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
