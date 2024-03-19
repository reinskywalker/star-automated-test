const fs = require('fs');
const { envDecoder, decryptData } = require('./utils');
const supertest = require ('supertest');
const { jsonToGraphQLQuery } = require ('json-to-graphql-query');

function writeFileEncrypted(envObject, encryptionKey) {
    const decodedEnv = envDecoder(envObject);
    const encryptedData = Object.entries(decodedEnv).map(([key, value]) => `${key}="${decryptData(value, encryptionKey)}"`).join('\n');
    
    fs.writeFile(".env", encryptedData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.info('Data has been written to file successfully.');
    });
}

const endpoints = (token, body) => {
    const api = supertest(global.BASE_URL_API_STAR);

    return api.post('/graphql')
        .set("Authorization", token)
        .send({
            query: jsonToGraphQLQuery(body, { pretty: true })
        });
};

module.exports = { writeFileEncrypted, endpoints };
