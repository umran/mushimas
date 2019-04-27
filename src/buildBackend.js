const validator = require('./validator')
const elasticsearch = require('./elasticsearch')
const { generateSignature } = require('mushimas-crypto')

module.exports = schemas => {
  // validate schemas
  validator.validateSchemas(schemas)

  // generate elasticsearch mappings
  const elastic_mappings = elasticsearch.generateElasticMappings(schemas)

  // generate projections and populations necessary for search indexing
  const elastic_projections = elasticsearch.generateElasticProjections(schemas)

  // generate signature
  const signature = generateSignature(schemas)

  return {
    elastic_mappings,
    elastic_projections,
    schemas,
    signature
  }
}
