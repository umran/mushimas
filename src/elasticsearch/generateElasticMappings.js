module.exports = schemas => {
  return Object.keys(schemas).reduce((accumulator, schemaKey) => {
    accumulator[schemaKey] = () => generateMapping(schemas[schemaKey], schemas, accumulator)

    return accumulator
    
  }, {})
}

const generateMapping = (schema, schemas, generatedMappings) => {
  return {
    properties: Object.keys(schema.fields).reduce((generated, fieldKey) => {
      const field = generateField(schema.fields[fieldKey], schemas, generatedMappings)

      if (field) {
        generated[fieldKey] = field
      }

      return generated

    }, {})
  }
}

const generateField = (field, schemas, generatedMappings) => {
  switch (field.type) {
    case "string":
      return generateStringField(field)
    case "integer":
      return generateIntegerField(field)
    case "float":
      return generateFloatField(field)
    case "boolean":
      return generateBooleanField(field)
    case "date":
      return generateDateField(field)
    case "array":
      return generateArrayField(field, schemas, generatedMappings)
    case "reference":
      return generateReferenceField(field, schemas, generatedMappings)
  }
}

const generateStringField = field => {
  return {
    type: field.es_keyword === true ? 'keyword' : 'text',
    index: field.es_indexed === false ? false : true
  }
}

const generateIntegerField = field => {
  return {
    type: 'integer',
    index: field.es_indexed === false ? false : true
  }
}

const generateFloatField = field => {
  return {
    type: 'float',
    index: field.es_indexed === false ? false : true
  }
}

const generateBooleanField = field => {
  return {
    type: 'boolean',
    index: field.es_indexed === false ? false : true
  }
}

const generateDateField = field => {
  return {
    type: 'date',
    index: field.es_indexed === false ? false : true
  }
}

const generateReferenceField = (field, schemas, generatedMappings) => {
  // ignore collection level references
  if (schemas[field.ref].class === 'collection') {
    return
  }

  return {
    type: 'object',
    enabled: field.es_indexed === false ? false : true,
    properties: generatedMappings[field.ref]().properties
  }
}

const generateArrayField = (field, schemas, generatedMappings) => {
  const _field = generateField(field.item, schemas, generatedMappings)

  if (!_field) {
    return
  }

  if (_field.type === 'object') {
    return {
      type: 'nested',
      properties: _field.properties
    }
  }

  return _field
}
