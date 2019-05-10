const { validateSchemas, validateReferences, validateEmbedded } = require('./validator')
const mongoose = require('./mongoose')
const elasticsearch = require('./elasticsearch')
const { generateSignature } = require('mushimas-crypto')

module.exports = (schemas, dedicated) => {
  // validate schemas
  validateSchemas(schemas)
  validateReferences(schemas)
  validateEmbedded(schemas)

  // generate mongoose schemas and models if dedicated is set to true
  let mongooseSchemas
  let mongooseModels

  if (dedicated === true) {
    mongooseSchemas = mongoose.generateMongooseSchemas(schemas)
    mongooseModels = mongoose.generateMongooseModels(schemas, mongooseSchemas)
  }

  // generate type mappings for search indexing
  const elasticMappings = elasticsearch.generateElasticMappings(schemas)

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
