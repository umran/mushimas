const { GraphQLInputObjectType, GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLList } = require('graphql')

const FindOptions = new GraphQLInputObjectType({
  name: '_FindOptions',
  fields: {
    paginate: {
      type: GraphQLBoolean
    },
    paginatedField: {
      type: GraphQLString
    },
    sortDirection: {
      type: GraphQLInt
    },
    limit: {
      type: GraphQLInt
    },
    cursor: {
      type: GraphQLString
    },
    includeArchived: {
      type: GraphQLBoolean
    }
  }
})

const FindOneOptions = new GraphQLInputObjectType({
  name: '_FindOneOptions',
  fields: {
    includeArchived: {
      type: GraphQLBoolean
    }
  }
})

const SearchOptions = new GraphQLInputObjectType({
  name: '_SearchOptions',
  fields: {
    paginate: {
      type: GraphQLBoolean
    },
    paginatedField: {
      type: GraphQLString
    },
    sortDirection: {
      type: GraphQLInt
    },
    limit: {
      type: GraphQLInt
    },
    cursor: {
      type: GraphQLString
    },
    matchFields: {
      type: new GraphQLList(GraphQLString)
    },
    includeArchived: {
      type: GraphQLBoolean
    }
  }
})

module.exports = {
  FindOptions,
  FindOneOptions,
  SearchOptions
}