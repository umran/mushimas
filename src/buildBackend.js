const { validateSchemas, validateReferences, validateEmbedded } = require('./validator')
const mongoose = require('./mongoose')
const elasticsearch = require('./elasticsearch')
const { generateSignature } = require('mushimas-crypto')
const { BuildError } = require('./errors')

module.exports = (schemas, mode) => {
  let mongooseModels
  let elasticMappings

  switch (mode) {
    case 'SHARED':
      // nothing specific needs to be done for a shared instance
      break

    case 'DEDICATED':
      // we validate the schemas only in dedicated mode because we assume schemas are prevalidated otherwise
      validateSchemas(schemas)
      validateReferences(schemas)
      validateEmbedded(schemas)

      // mongoose schemas and models and elastic mappings are all generated in dedicated mode
      const mongooseSchemas = mongoose.generateMongooseSchemas(schemas)
      mongooseModels = mongoose.generateMongooseModels(schemas, mongooseSchemas)
      elasticMappings = elasticsearch.generateElasticMappings(schemas)
      break

    default:
      throw new BuildError('unrecognizedMode', 'the mode specified is not one that Mushimas recognizes')
  }

  // generate signature
  const signature = generateSignature(schemas)

  return {
    mongoose_models: mongooseModels,
    elastic_mappings: elasticMappings,
    signature
  }
}
