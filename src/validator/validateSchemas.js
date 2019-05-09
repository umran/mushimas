const validateSchema = require('./validateSchema')
const { SchemaError } = require('../errors')


module.exports = schemas => {
  Object.keys(schemas).forEach(schemaKey => {
    try {
      validateSchema(schemas[schemaKey])
    } catch (err) {
      throw new SchemaError('validationError', `the following schema: ${schemaKey} is invalid. Please check that it conforms to the specification described at https://irukandjilabs.com/apify/spec.`)
    }
  })
}
