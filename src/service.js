const repository = require('./repository')

module.exports = (customerId, requestedFeaturesNames) => {
  const features = repository.find({ customerId, requestedFeaturesNames })
  if (!requestedFeaturesNames) {
    return features
  }

  const result = {}
  requestedFeaturesNames.forEach(featureName => {
    result[featureName] = features[featureName] || false
  })
  return result
}
