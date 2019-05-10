const { SchemaError } = require('../errors')

const findReferences = schema => {
  const fields = schema.fields

  return Object.keys(fields).reduce((refs, fieldKey) => {
    const field = fields[fieldKey]

    if (field.type === 'reference') {
      refs.push(field.ref)
    } else if (field.type === 'array' && field.item.type === 'reference') {
      refs.push(field.item.ref)
    }

    return refs
  }, [])
}

module.exports = schemas => {
  let validRefs = Object.keys(schemas)

  Object.keys(schemas).forEach(schemaKey => {
    const refs = findReferences(schemas[schemaKey])

    refs.forEach(ref => {
      if (!validRefs.includes(ref)) {
        throw new SchemaError('nullReference', `the following schema: ${schemaKey} makes a reference to an undefined schema: ${ref}`)
      }
    })
  })
}