const supertest = require('supertest');
const jsonToGraphQLQuery = require('json-to-graphql-query');

/**
 * Performs a POST request to a GraphQL endpoint with the provided token and body.
 * @param {string} baseUrl The base URL of the GraphQL endpoint.
 * @param {string} token The authorization token.
 * @param {object} body The GraphQL query/mutation body.
 * @returns {Promise} A promise representing the POST request.
 */
function GraphQLClient(token, body) {
    const api = supertest(global.BASE_URL_API_STAR);
    return api.post('/graphql')
        .set("Authorization", token)
        .send({
            query: jsonToGraphQLQuery(body, { pretty: true })
        });
}

module.exports = { GraphQLClient };
