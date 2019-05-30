const { validateSchemas, validateReferences, validateEmbedded } = require('./validator')
const mongoose = require('./mongoose')
const elasticsearch = require('./elasticsearch')
const { generateSignature } = require('mushimas-crypto')

module.exports = (schemas, dedicated) => {
  // generate mongoose schemas and models and elasticsearch mappings only in dedicated mode
  let mongooseSchemas
  let mongooseModels
  let elasticMappings

  if (dedicated === true) {
    // we validate the schemas only in dedicated mode because we assume schemas are prevalidated otherwise
    validateSchemas(schemas)
    validateReferences(schemas)
    validateEmbedded(schemas)

    mongooseSchemas = mongoose.generateMongooseSchemas(schemas)
    mongooseModels = mongoose.generateMongooseModels(schemas, mongooseSchemas)
    elasticMappings = elasticsearch.generateElasticMappings(schemas)
  }

  // generate projections necessary for search indexing
  const elasticProjections = elasticsearch.generateElasticProjections(schemas)

  // generate signature
  const signature = generateSignature(schemas)

  return {
    mongoose_models: mongooseModels,
    elastic_mappings: elasticMappings,
    elastic_projections: elasticProjections,
    signature
  }
}
