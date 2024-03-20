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

export const uploadImage = async (token, filePath, microservices) => {
    const fileName = filePath.split('/').slice(-1).join('');
    const microservicesToCamelize = microservices.split(/\s+/)
    .map(function(word, index) {
      return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');

    // Upload Request
    const paramUploadRequest = {
        input: {
            fileName
        }
    }

    const uploadRequest = () => ({
        mutation: {
            [`uploadRequestFrom${microservicesToCamelize}`]: {
                __args: paramUploadRequest,
                resourceId: true,
                token: true
            }
        }
    })

    const responseUploadRequest = await endpoints(token, uploadRequest());
    const dataUploadRequest = responseUploadRequest.body.data[`uploadRequestFrom${microservicesToCamelize}`];
    expect(dataUploadRequest.hasOwnProperty('resourceId')).toBe(true);

    const url = dataUploadRequest.token;
    const resourceId = dataUploadRequest.resourceId;

    // PUT Image
    const fileData = fs.readFileSync(filePath);

    const responseImage = await axios({
        method: "put",
        url,
        data: Buffer.from(fileData),
        headers: { "Content-Type": "multipart/form-data", "x-ms-blob-type": "BlockBlob" }
    });

    expect(responseImage.status).toBe(201);

    // Upload Complete
    const paramuploadComplete = {
        input: {
            resourceId,
            token: url
        }
    }

    const uploadComplete = () => ({
        mutation: {
            [`uploadCompleteFrom${microservicesToCamelize}`]: {
                __args: paramuploadComplete,
                operationId: true
            }
        }
    })

    const responseuploadComplete = await endpoints(token, uploadComplete());
    const dataUploadComplete = responseuploadComplete.body.data[`uploadCompleteFrom${microservicesToCamelize}`];

    expect(dataUploadComplete.hasOwnProperty('operationId')).toBe(true);

    return {operationId: dataUploadComplete.operationId, url};
}

module.exports = { writeFileEncrypted, endpoints };
