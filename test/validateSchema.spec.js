const expect = require('chai').expect
const { validateSchema } = require('../src/validator')
const data = require('./data').validateSchemas
const { SchemaError } = require('../src/errors')

describe('validateSchema()', () => {
  it('should validate a valid schema without raising an exception', () => {

    const configurationSchema = data.validConfigurationSchemas['Dummy']

    const test = () => {
      validateSchema(configurationSchema)
    }

    expect(test).to.not.throw()

  })

  it('should throw a SchemaError with a code of validationError on validating an invalid configuration schema', () => {

    const configurationSchema = data.invalidConfigurationSchemas['PersonSchema']

    const test = () => {
      validateSchema(configurationSchema)
    }

    expect(test).to.throw(SchemaError, /^validationError/)

  })
})