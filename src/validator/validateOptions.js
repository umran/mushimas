const validateMatchFields = require('./validateMatchFields')
const validatePaginatedField = require('./validatePaginatedField')

module.exports = (args, schemaKey, schemas) => {
  let { _options: options } = args

  if (!options) {
    return
  }

  let { paginatedField, matchFields } = options

  if (paginatedField) {
    validatePaginatedField(paginatedField, schemaKey, schemas)
  }

  if (matchFields) {
    validateMatchFields(matchFields, schemaKey, schemas)
  }
}