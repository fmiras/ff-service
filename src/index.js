const repository = require('./repository')

module.exports = (customerId, requestedFeaturesNames) => {
  const features = repository.find({ customerId, requestedFeaturesNames })
  const result = {}
  requestedFeaturesNames.forEach(featureName => {
    result[featureName] = features[featureName] || false
  })
  return result
}
