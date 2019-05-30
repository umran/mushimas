const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql')

const MutationResultType = new GraphQLObjectType({
  name: '_MutationResult',
  fields: () => ({
    status: {
      type: GraphQLString
    },
    message: {
      type: GraphQLString
    },
    _id: {
      type: GraphQLID
    }
  })
})

module.exports = MutationResultType