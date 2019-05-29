const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql')

const mutationResultType = new GraphQLObjectType({
  name: 'mutationResult',
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

module.exports = mutationResultType