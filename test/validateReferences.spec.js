const expect = require('chai').expect
const { validateReferences } = require('../src/validator')
const { SchemaError } = require('../src/errors')

const badSchemaConfig = {
  person: {
    class: 'collection',
    fields: {
      contact: {
        type: 'reference',
        required: true,
        enabled: true,
        es_indexed: true,
        ref: 'contact'
      },
      addresses: {
        type: 'array',
        required: true,
        item: {
          type: 'reference',
          required: true,
          enabled: true,
          es_indexed: true,
          ref: 'address'
        }
      }
    }
  },
  contact: {
    class: 'embedded',
    fields: {
      number: {
        type: 'integer',
        required: true,
        enabled: true,
        es_indexed: true
      }
    }
  }
}

const goodSchemaConfig = {
  person: {
    class: 'collection',
    fields: {
      contact: {
        type: 'reference',
        required: true,
        enabled: true,
        es_indexed: true,
        ref: 'contact'
      }
    }
  },
  contact: {
    class: 'embedded',
    fields: {
      number: {
        type: 'integer',
        required: true,
        enabled: true,
        es_indexed: true
      }
    }
  }
}

describe('validateReferences()', () => {
  it('should throw a SchemaError with a code of nullReference when a schema config has a reference to an undefined schema', () => {
    const test = () => {
      validateReferences(badSchemaConfig)
    }

    expect(test).to.throw(SchemaError, /^nullReference/)
  })

  it('should run without exception when all schema references are defined in the schema config', () => {
    const test = () => {
      validateReferences(goodSchemaConfig)
    }

    expect(test).to.not.throw()
  })
})