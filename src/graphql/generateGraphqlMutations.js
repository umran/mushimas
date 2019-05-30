const { GraphQLObjectType, GraphQLID, GraphQLNonNull } = require('graphql')
const { FindOptions, SearchOptions } = require('./staticGraphqlInputTypes')
const generateArg = require('./createGraphqlArg')
const generateStrictArg = require('./createGraphqlStrictArg')
const MutationResultType = require('./mutationResultType')

module.exports = (schemas, types, resolver) => {
  return new GraphQLObjectType({
    name: 'Mutation',
    fields: Object.keys(schemas).reduce((accumulator, schemaKey) => {
      if (schemas[schemaKey].class === 'collection') {
        accumulator[`create_${schemaKey}`] = createCreateField(schemaKey, schemas, types, resolver)
        accumulator[`update_${schemaKey}`] = createUpdateField(schemaKey, schemas, types, resolver)
        accumulator[`delete_${schemaKey}`] = createDeleteField(schemaKey, resolver)
        accumulator[`publish_${schemaKey}`] = createPublishField(schemaKey, resolver)
        accumulator[`archive_${schemaKey}`] = createArchiveField(schemaKey, resolver)
      }

      return accumulator
    }, {})
  })
}

const createCreateField = (schemaKey, schemas, types, resolver) => {
  return {
    type: MutationResultType,
    args: Object.keys(schemas[schemaKey].fields).reduce((accumulator, fieldKey) => {
      let generatedStrictArg = generateStrictArg(schemas[schemaKey].fields[fieldKey], schemas, types)

      if (generatedStrictArg) {
        accumulator[fieldKey] = generatedStrictArg
      }

      return accumulator
    }, {}),
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'create',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}

const createUpdateField = (schemaKey, schemas, types, resolver) => {
  return {
    type: MutationResultType,
    args: Object.keys(schemas[schemaKey].fields).reduce((accumulator, fieldKey) => {
      let generatedArg = generateArg(schemas[schemaKey].fields[fieldKey], schemas, types)

      if (generatedArg) {
        accumulator[fieldKey] = generatedArg
      }

      return accumulator
    }, { _id: { type: new GraphQLNonNull(GraphQLID) } }),
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'update',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}

const createDeleteField = (schemaKey, resolver) => {
  return {
    type: MutationResultType,
    args: {
      _id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'delete',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}

const createPublishField = (schemaKey, resolver) => {
  return {
    type: MutationResultType,
    args: {
      _id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'publish',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}

const createArchiveField = (schemaKey, resolver) => {
  return {
    type: MutationResultType,
    args: {
      _id: {
        type: new GraphQLNonNull(GraphQLID)
      }
    },
    resolve: async (root, args, context) => {
      return await resolver({
        method: 'archive',
        collection: schemaKey,
        root,
        args,
        context
      })
    }
  }
}
