const { exists } = require('../utils')
const { SchemaError } = require('../errors')

module.exports = schemas => {
  let embeddedKeys = Object.keys(schemas).filter(schemaKey => schemas[schemaKey].class === 'embedded')

  let dependencies = embeddedKeys.reduce((accumulator, key) => {
    accumulator[key] = getDependencies(key, schemas)

    return accumulator
  }, {})

  iterate(embeddedKeys, dependencies)
  
}

const iterate = (remainingKeys, dependencies, foundations=[]) => {
  for (let i = 0; i < remainingKeys.length; i++) {
    let key = remainingKeys[i]

    if (dependencies[key].length === 0) {
      foundations.push(key)
      return iterate(remainingKeys.filter(key =>
        !foundations.includes(key)), dependencies, foundations)

    } else if (dependencies[key].reduce((truthValue, dependency) => {
      
      if (!exists(foundations, foundation => foundation === dependency)) {
        return false
      }

      return truthValue
    }, true)) {
      foundations.push(key)
      return iterate(remainingKeys.filter(key =>
        !foundations.includes(key)), dependencies, foundations)
    }
  }

  if (remainingKeys.length > 0) {
    throw new SchemaError('embeddedCircularRelationship')
  }
}

const getDependencies = (schemaKey, schemas) => {
  const fields = schemas[schemaKey].fields

  return Object.keys(fields).reduce((references, fieldKey) => {
    let reference = getReference(fields[fieldKey])

    if (reference && schemas[reference].class === 'embedded') {
      references.push(reference)
    }

    return references
  }, [])
}

const getReference = (field) => {
  let reference
  
  if (field.type === 'reference') {
    reference = field.ref
  } else if (field.type === 'array' 
    && field.item.type === 'reference') {
    reference = field.item.ref
  }

  return reference
}