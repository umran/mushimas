const expect = require('chai').expect
const validateSchemas = require('../src/validator/validateSchemas')
const validateEmbedded = require('../src/validator/validateEmbedded')
const data = require('./data').validateSchemas
const errors = require('../src/errors')

describe('validateSchemas()', () => {
  it('should validate a valid set of configuration schemas without raising an exception', () => {

    const configurationSchemas = data.validConfigurationSchemas

    const test = () => {
      validateSchemas(configurationSchemas)
    }

    expect(test).to.not.throw()

  })

  it('should throw a SchemaError with a code of validationError on validating an invalid set of configuration schemas', () => {

    const configurationSchemas = data.invalidConfigurationSchemas

    const test = () => {
      validateSchemas(configurationSchemas)
    }

    expect(test).to.throw(errors.SchemaError, /^validationError/)

  })
})

describe('validateEmbedded()', () => {
  it('should throw a SchemaError with a code of embeddedCircularRelationship given a circular chain of embedded documents', () => {
    const configurationSchemas = {
      a: {
        class: 'embedded',
        fields: {
          b: {
            type: 'reference',
            required: true,
            es_indexed: true,
            ref: 'b'
          }
        }
      },
      b: {
        class: 'embedded',
        fields: {
          c: {
            type: 'reference',
            required: true,
            es_indexed: true,
            ref: 'c'
          }
        }
      },
      c: {
        class: 'embedded',
        fields: {
          a: {
            type: 'array',
            required: true,
            item: {
              type: 'reference',
              required: true,
              es_indexed: true,
              ref: 'a'
            }
          }
        }
      }
    }

    const test = () => {
      validateEmbedded(configurationSchemas)
    }

    expect(test).to.throw(errors.SchemaError, /^embeddedCircularRelationship/)
  })

  it('should run without any errors when there are no circular references between embedded documents', () => {
    const configurationSchemas = {
      a: {
        class: 'embedded',
        fields: {
          b: {
            type: 'reference',
            required: true,
            es_indexed: true,
            ref: 'b'
          }
        }
      },
      b: {
        class: 'embedded',
        fields: {
          c: {
            type: 'reference',
            required: true,
            es_indexed: true,
            ref: 'c'
          }
        }
      },
      c: {
        class: 'embedded',
        fields: {
          name: {
            type: 'string',
            required: true,
            es_indexed: true,
            es_keyword: false
          }
        }
      }
    }

    const test = () => {
      validateEmbedded(configurationSchemas)
    }

    expect(test).to.not.throw()
  })
})
