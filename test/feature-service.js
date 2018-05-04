const test = require('ava')
const rewire = require('rewire')

const getFeatures = rewire('../src')
const repository = require('./fixtures/repository')

getFeatures.__set__('repository', repository)

test('getFeatures of costumer with logging and roles features enabled', t => {
  const customerId = 1
  const features = getFeatures(customerId, ['logging', 'roles'])
  const expectedFeatures = {
    logging: '2.1.0',
    roles: '1.7.0'
  }
  t.deepEqual(features, expectedFeatures)
})

test('getFeatures of costumer with logging enabled and mfa disabled', t => {
  const customerId = 1
  const features = getFeatures(customerId, ['logging', 'mfa'])
  const expectedFeatures = {
    logging: '2.1.0',
    mfa: false
  }
  t.deepEqual(features, expectedFeatures)
})
