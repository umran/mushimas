const expect = require('chai').expect
const buildBackend = require('../src/buildBackend')
const { BuildError } = require('../src/errors')
const data = require('./data').buildBackend

const mongoose = require('mongoose')

describe('buildBackend()', () => {
  it('should take valid configuration schemas and return an object containing mongoose models and elasticsearch mappings', () => {

    // cleanup mongoose
    mongoose.models = {}
    mongoose.modelSchemas = {}

    const configurationSchemas = data.configurationSchemas

    const backend_shared = buildBackend(configurationSchemas, 'SHARED')

    expect(backend_shared).to.have.own.property('mongoose_models')
    expect(backend_shared).to.have.own.property('elastic_mappings')
    expect(backend_shared).to.have.own.property('elastic_projections')
    expect(backend_shared).to.have.own.property('signature')

    const backend_dedicated = buildBackend(configurationSchemas, 'DEDICATED')

    expect(backend_dedicated).to.have.own.property('mongoose_models')
    expect(backend_dedicated).to.have.own.property('elastic_mappings')
    expect(backend_dedicated).to.have.own.property('elastic_projections')
    expect(backend_dedicated).to.have.own.property('signature')

  })

  it('should throw a BuildError with code unrecognizedMode when an unfamiliar mode is provided', () => {
    const configurationSchemas = data.configurationSchemas

    const test = () => {
      buildBackend(configurationSchemas, 'BOGUS_MODE')
    }

    expect(test).to.throw(BuildError, /^unrecognizedMode/)
  })

})
