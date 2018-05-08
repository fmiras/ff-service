require('dotenv').config()
const { parse } = require('url')
const { json, createError } = require('micro')
const validate = require('micro-validate')
const cache = require('micro-cacheable')
const { router, get, patch, put, post } = require('microrouter')

const {
  getFeatures,
  addFeatures,
  setFeatures,
  createCustomer
} = require('./service')

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
  const { features } = await json(req)
  const id = Number(req.params.id)
  const message = `The pathname ${pathname} must be a customer ID (number).`
  validate({ id }, p => Number.isInteger(p), message)
  return override
    ? setFeatures({ customerId: id, features })
    : addFeatures({ customerId: id, features })
}

const addFeaturesHandler = async req => {
  return update(req, false)
}

const setFeaturesHandler = async req => {
  return update(req, true)
}

const createCustomerHandler = async req => {
  const customer = await json(req)
  return createCustomer(customer)
}

const microFn = router(
  get('/:id', getFeaturesHandler),
  patch('/:id', addFeaturesHandler),
  put('/:id', setFeaturesHandler),
  post('/', createCustomerHandler)
)

module.exports = cache(CACHE_TIME, microFn)
