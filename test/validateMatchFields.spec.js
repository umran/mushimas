const expect = require('chai').expect
const validateMatchFields = require('../src/validator/validateMatchFields')
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
      aliases: {
        type: 'array',
        required: true,
        item: {
          type: 'string',
          es_indexed: true,
          required: false,
          enabled: true,
          keyword: false
        }
      },
      classifiedAliases: {
        type: 'array',
        required: true,
        item: {
          type: 'string',
          es_indexed: true,
          required: false,
          enabled: false,
          keyword: false
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
      contacts: {
        type: 'array',
        required: true,
        item: {
          type: 'reference',
          required: true,
          es_indexed: true,
          enabled: true,
          ref: 'contact'
        }
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

describe('validateMatchFields()', () => {
  it('should throw an OptionsError with a code of invalidSyntax when the field path does not conform to the specified format', () => {
    const fields = ['dog.']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^invalidSyntax/)
  })

  it('should throw an OptionsError with a code of undefinedField when a non existent field is provided in the path', () => {
    const fields = ['dog']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^undefinedField/)
  })

  it('should throw an OptionsError with a code of invalidTerminalArrayType when passed an array as the terminal field where array item is not a terminal type', () => {
    const fields = ['locations']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^invalidTerminalArrayType/)
  })

  it('should throw an OptionsError with a code of invalidIntermediateTerminalArrayType when passed an array as an intermediate field where the array item is a terminal type', () => {
    const fields = ['aliases.whatever']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^invalidIntermediateTerminalArrayType/)
  })

  it('should throw an OptionsError with a code of disabledField when passed a disabled field as an array item', () => {
    const fields = ['classifiedAliases']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^disabledField/)
  })

  it('should throw an OptionsError with a code of disabledField when passed a disabled non array field', () => {
    const fields = ['gender']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^disabledField/)
  })

  it('should throw an OptionsError with a code of terminalReference when a reference field is the terminal field in the path', () => {
    const fields = ['contact']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^terminalReference/)
  })

  it('should throw an OptionsError with a code of collectionReference when a collection reference is present in the path', () => {
    const fields = ['address.city']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^collectionReference/)
  })

  it('should throw an OptionsError with a code of intermediateTerminal when a terminal field is provided as an intermediate field', () => {
    const fields = ['firstName.whatever']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.throw(OptionsError, /^intermediateTerminal/)
  })

  it('should not throw when a valid path to a terminal field in an embedded reference document is provided', () => {
    const fields = ['contact.email']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.not.throw()
  })

  it('should not throw when a valid path to a terminal field in an array is provided', () => {
    const fields = ['aliases']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.not.throw()
  })

  it('should not throw when a valid path to a terminal field in an embedded reference inside an array is provided', () => {
    const fields = ['contacts.email']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.not.throw()
  })

  it('should not throw when a valid path to a terminal field in an embedded reference document is provided', () => {
    const fields = ['contact.email']

    const test = () => {
      validateMatchFields(fields, schemaKey, schemas)
    }

    expect(test).to.not.throw()
  })
})