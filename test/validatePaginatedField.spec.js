const expect = require('chai').expect
const validatePaginatedField = require('../src/validator/validatePaginatedField')
const { OptionsError } = require('../src/errors')

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

describe('validatePaginatedField()', () => {
  it('should throw an OptionsError with a code of invalidSyntax when the field path does not conform to the specified format', () => {
    const path = 'dog.'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^invalidSyntax/)
  })

  it('should throw an OptionsError with a code of undefinedField when a non existent field is provided in the path', () => {
    const path = 'dog'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^undefinedField/)
  })

  it('should throw an OptionsError with a code of nonRequiredField when a non required field is present in the path', () => {
    const path = 'lastName'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^nonRequiredField/)
  })

  it('should throw an OptionsError with a code of arrayField when an array field is present in the path', () => {
    const path = 'locations'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^arrayField/)
  })

  it('should throw an OptionsError with a code of disabledField when a disabled field is present in the path', () => {
    const path = 'gender'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^disabledField/)
  })

  it('should throw an OptionsError with a code of terminalReference when a reference field is the terminal field in the path', () => {
    const path = 'contact'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^terminalReference/)
  })

  it('should throw an OptionsError with a code of collectionReference when a collection reference is present in the path', () => {
    const path = 'address.city'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^collectionReference/)
  })

  it('should throw an OptionsError with a code of intermediateTerminal when a terminal field is provided as an intermediate field', () => {
    const path = 'firstName.whatever'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^intermediateTerminal/)
  })

  it('should not throw when a valid path to a terminal field in an embedded reference document is provided', () => {
    const path = 'contact.email'

    const test = () => {
      validatePaginatedField(path, schemaKey, schemas)
    }

    expect(test).to.not.throw()
  })
})