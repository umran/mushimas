const buildBackend = require('./buildBackend')
const graphql = require('./graphql')

module.exports = (schemas, generateResolver, dedicated=true) => {
  const backend = buildBackend(schemas, dedicated)

  // generate resolver function
  const resolver = generateResolver({ ...backend })

  // generate graphql schema
  const types = graphql.generateGraphqlTypes(schemas, resolver)
  const queries = graphql.generateGraphqlQueries(schemas, types, resolver)
  const mutations = graphql.generateGraphqlMutations(schemas, types, resolver)
  const graphqlSchema = graphql.generateGraphqlSchema(queries, mutations)

  return {
    graphqlSchema,
    backend
  }
}
