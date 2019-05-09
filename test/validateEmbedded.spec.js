const expect = require('chai').expect
const { validateEmbedded } = require('../src/validator')
const { SchemaError } = require('../src/errors')

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
            ref: 'b',
            enabled: true
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
            ref: 'c',
            enabled: true
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
              ref: 'a',
              enabled: true
            }
          }
        }
      }
    }

    const test = () => {
      validateEmbedded(configurationSchemas)
    }

    expect(test).to.throw(SchemaError, /^embeddedCircularRelationship/)
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
            ref: 'b',
            enabled: true
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
            ref: 'c',
            enabled: true
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
            es_keyword: false,
            enabled: true
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