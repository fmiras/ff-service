require('dotenv').config()
const { parse } = require('url')
const { json, createError } = require('micro')
const validate = require('micro-validate')
const cache = require('micro-cacheable')
const { router, get, patch, put } = require('microrouter')

const { getFeatures, addFeatures, setFeatures } = require('./service')

const { CACHE_TIME } = process.env

const getFeaturesHandler = async req => {
  const { query, pathname } = parse(req.url, true)
  const id = Number(req.params.id)
  let featuresQuery
  if (query.query) {
    featuresQuery = query.query.split(',')
  }
  const message = `The pathname ${pathname} must be a customer ID (number).`
  validate({ id }, p => Number.isInteger(p), message)
  const features = await getFeatures(id, featuresQuery)
  if (!features) {
    createError(404, `The customer ${id} doesn't exist.`)
  }
  return features
}

const update = async (req, override) => {
  const { pathname } = parse(req.url, true)
  const customer = await json(req)
  console.log(customer)
  const id = Number(req.params.id)
  const message = `The pathname ${pathname} must be a customer ID (number).`
  validate({ id }, p => Number.isInteger(p), message)
  const updated = override
    ? await setFeatures(customer)
    : await addFeatures(customer)
  if (updated) {
    return 'Operation successfully completed.'
  }
  createError(409, 'Operation failed.')
}

const addFeaturesHandler = async req => {
  return update(req, false)
}

const setFeaturesHandler = async req => {
  return update(req, true)
}

const microFn = router(
  get('/:id', getFeaturesHandler),
  patch('/:id', addFeaturesHandler),
  put('/:id', setFeaturesHandler)
)

module.exports = cache(CACHE_TIME, microFn)
