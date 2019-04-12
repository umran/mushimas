const validator = require('./validator')
const mongoose = require('./mongoose')
const elasticsearch = require('./elasticsearch')
const { generateSignature } = require('./crypto')

module.exports = schemas => {
  // validate schemas
  validator.validateSchemas(schemas)

  // generate mongoose models
  const mongooseSchemas = mongoose.generateMongooseSchemas(schemas)
  const mongoose_models = mongoose.generateMongooseModels(schemas, mongooseSchemas)

  // generate elasticsearch mappings
  const elastic_mappings = elasticsearch.generateElasticMappings(schemas)

  // generate projections and populations necessary for search indexing
  const elastic_projections = elasticsearch.generateElasticProjections(schemas)

  // generate signature
  const signature = generateSignature(schemas)

  return {
    mongoose_models,
    elastic_mappings,
    elastic_projections,
    schemas,
    signature
  }
}
