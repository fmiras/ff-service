require('dotenv').config()
const { parse } = require('url')
const { createError } = require('micro')
const validate = require('micro-validate')

const getFeatures = require('./service')

module.exports = async req => {
  const { query, pathname } = parse(req.url, true)
  const id = Number(pathname.substring(1)) // Remove '/' from pathname
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
