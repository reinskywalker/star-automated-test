import fs from 'fs';
import supertest from 'supertest';
import { generateRandomEmail } from './libs/email_generator';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { generateRandomName } from './libs/name_generator';
import { uploadImage } from './libs/graphql.req';
const { envDecoder, decryptData } = require('./utils');

/**
 * Author : Andre Reynaldi Lusikooy
 * Writes decrypted environment data to a file.
 * @param {Object} envObject The environment object to be decrypted and written to the file.
 * @param {string} encryptionKey The encryption key used for decryption.
 */
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

/**
 * Sends a GraphQL request to the specified API endpoint.
 * @param {string} token The authorization token for the request.
 * @param {Object} body The request body containing the GraphQL query.
 * @returns {Promise} A promise that resolves with the response from the API.
 */
const endpoints = (token, body) => {
    const api = supertest(global.BASE_URL_API_STAR);
    return api.post('/graphql')
        .set("Authorization", token)
        .send({
            query: jsonToGraphQLQuery(body, { pretty: true })
        });
};

module.exports = { 
    writeFileEncrypted, 
    endpoints, 
    uploadImage, 
    generateRandomName,
    generateRandomEmail
};
