const { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString } = require('graphql')
const { FindOptions, SearchOptions } = require('./staticGraphqlInputTypes')
const generateArg = require('./createGraphqlArg')

module.exports = (schemas, types, resolver) => {
  return new GraphQLObjectType({
    name: 'Query',
    fields: Object.keys(schemas).reduce((accumulator, schemaKey) => {
      if (schemas[schemaKey].class === 'collection') {
        accumulator[`findOne_${schemaKey}`] = createFindOneField(schemaKey, types, resolver)
        accumulator[`find_${schemaKey}`] = createFindField(schemaKey, schemas, types, resolver)
        accumulator[`previewOne_${schemaKey}`] = createPreviewOneField(schemaKey, types, resolver)
        accumulator[`preview_${schemaKey}`] = createPreviewField(schemaKey, schemas, types, resolver)
        accumulator[`search_${schemaKey}`] = createSearchField(schemaKey, types, resolver)
      }

      return accumulator
    }, {})
  })
}

const createFindOneField = (schemaKey, types, resolver) => {
  return {
    type: types[schemaKey].objectType,
    args: {
      _id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'findOne',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}

const createFindField = (schemaKey, schemas, types, resolver) => {
  return {
    type: new GraphQLNonNull(types[schemaKey].resultsType),
    args: Object.keys(schemas[schemaKey].fields).reduce((accumulator, fieldKey) => {
      let generatedArg = generateArg(schemas[schemaKey].fields[fieldKey], schemas, types)

      if (generatedArg) {
        accumulator[fieldKey] = generatedArg
      }
      
      return accumulator
    }, { _id: { type: GraphQLID }, _options: { type: FindOptions } }),
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'find',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}

const createPreviewOneField = (schemaKey, types, resolver) => {
  return {
    type: types[schemaKey].objectType,
    args: {
      _id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'previewOne',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}

const createPreviewField = (schemaKey, schemas, types, resolver) => {
  return {
    type: new GraphQLNonNull(types[schemaKey].resultsType),
    args: Object.keys(schemas[schemaKey].fields).reduce((accumulator, fieldKey) => {
      let generatedArg = generateArg(schemas[schemaKey].fields[fieldKey], schemas, types)

      if (generatedArg) {
        accumulator[fieldKey] = generatedArg
      }
      
      return accumulator
    }, { _id: { type: GraphQLID }, _options: { type: FindOptions } }),
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'preview',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}

const createSearchField = (schemaKey, types, resolver) => {
  return {
    type: new GraphQLNonNull(types[schemaKey].resultsType),
    args: {
      query: {
        type: new GraphQLNonNull(GraphQLString)
      },
      _options: {
        type: SearchOptions
      }
    },
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'search',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}
