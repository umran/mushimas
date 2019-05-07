const expect = require('chai').expect
const validateOptions = require('../src/validator/validateOptions')

const schemas = {
  person: {
    class: 'collection',
    fields: {
      firstName: {
        type: 'string',
        es_indexed: true,
        required: true,
        enabled: true,
        keyword: false
      },
      lastName: {
        type: 'string',
        es_indexed: true,
        required: false,
        enabled: true,
        keyword: false
      },
      locations: {
        type: 'array',
        required: true,
        item: {
          type: 'reference',
          required: true,
          es_indexed: true,
          enabled: true,
          ref: 'address'
        }
      },
      gender: {
        type: 'string',
        es_indexed: true,
        required: true,
        enabled: false,
        keyword: false
      },
      contact: {
        type: 'reference',
        required: true,
        es_indexed: true,
        enabled: true,
        ref: 'contact'
      },
      address: {
        type: 'reference',
        required: true,
        es_indexed: true,
        enabled: true,
        ref: 'address'
      }
    }
  },
  contact: {
    class: 'embedded',
    fields: {
      email: {
        type: 'string',
        es_indexed: true,
        required: true,
        enabled: true,
        keyword: false
      }
    }
  },
  address: {
    class: 'collection',
    fields: {
      city: {
        type: 'string',
        es_indexed: true,
        required: true,
        enabled: true,
        keyword: false
      }
    }
  }
}

const schemaKey = 'person'

describe('validateOptions()', () => {
  it('should not raise any errors if the _options parameter is undefined', () => {
    const test = () => {
      validateOptions({}, schemaKey, schemas)
    }

    expect(test).to.not.throw()
  })

  it('should not raise any errors if a valid paginatedField parameter is provided as _options', () => {
    const _options = { paginatedField: 'contact.email' }

    const test = () => {
      validateOptions({ _options }, schemaKey, schemas)
    }

    expect(test).to.not.throw()
  })

  it('should not raise any errors if a valid matchFields parameter is provided as _options', () => {
    const _options = { matchFields: ['contact.email'] }

    const test = () => {
      validateOptions({ _options }, schemaKey, schemas)
    }

    expect(test).to.not.throw()
  })
})