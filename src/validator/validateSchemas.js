const Ajv = require('ajv')
const SchemaError = require('../errors').SchemaError
const validateEmbedded = require('./validateEmbedded')

// import type schemas
const arraySchema = require('./schemas/types/array.json')
const booleanSchema = require('./schemas/types/boolean.json')
const dateSchema = require('./schemas/types/date.json')
const floatSchema = require('./schemas/types/float.json')
const integerSchema = require('./schemas/types/integer.json')
const stringSchema = require('./schemas/types/string.json')
const referenceSchema = require('./schemas/types/reference.json')

// import root schema
const rootSchema = require('./schemas/root.json')

const ajv = new Ajv({ allErrors: true })
const validate = ajv.addSchema([arraySchema, booleanSchema, dateSchema, floatSchema, integerSchema, stringSchema, referenceSchema]).compile(rootSchema)


module.exports = schemas => {
  Object.keys(schemas).forEach(schemaKey => {
    if(!validate(schemas[schemaKey])) {
      throw new SchemaError(`validationError, the following schema: ${schemaKey} is invalid. Please check that it conforms to the specification described at https://irukandjilabs.com/apify/spec.`)
    }
  })

  validateEmbedded(schemas)
}
