const { GraphQLInputObjectType, GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLList } = require('graphql')

const FindOptions = new GraphQLInputObjectType({
  name: '_FindOptions',
  fields: {
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
    }
  }
})

const SearchOptions = new GraphQLInputObjectType({
  name: '_SearchOptions',
  fields: {
    limit: {
      type: GraphQLInt
    },
    cursor: {
      type: GraphQLString
    }
  }
})

module.exports = {
  FindOptions,
  SearchOptions
}