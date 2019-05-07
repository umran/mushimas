const { OptionsError } = require('../errors') 

module.exports = (path, schemaKey, schemas) => {
  const paginatedFieldPattern = /^[a-z]+(?:\.[a-z]+)*$/i
  const terminalTypes = ['string', 'integer', 'float', 'date', 'boolean']

  if (paginatedFieldPattern.test(path) === false) {
    throw new OptionsError('invalidSyntax', 'the field provided could not be parsed into a recognizable path')
  }

  const normalizedPath = path.split('.')

  let currentSchema = schemas[schemaKey]

  for (let i=0; i<normalizedPath.length; i++) {
    let field = currentSchema.fields[normalizedPath[i]]
    
    if (!field) {
      throw new OptionsError('undefinedField', 'the field provided is undefined')
    }

    if (!field.required) {
      throw new OptionsError('nonRequiredField', 'path cannot have a non required field')
    }

    if (field.type === 'array') {
      throw new OptionsError('arrayField', 'path cannot have an array field')
    } else if (field.enabled === false) {
      throw new OptionsError('disabledField', 'path cannot have a disabled field')
    }

    if (field.type === 'reference') {
      if (i === normalizedPath.length - 1) {
        throw new OptionsError('terminalReference', 'path cannot have a reference as the terminal field')   
      }

      if (schemas[field.ref].class === 'collection') {
        throw new OptionsError('collectionReference', 'path cannot have a reference to a collection level document')
      }

      currentSchema = schemas[field.ref]
    }

    if (terminalTypes.includes(field.type)) {
      if (i !== normalizedPath.length - 1) {
        throw new OptionsError('intermediateTerminal', 'terminal types can only be at the end of the path')
      }
    }
  }
}