const fs = require('fs');
const axios = require('axios');
const { endpoints } = require('../libs/graphql.endpoints');

/**
 * Uploads an image to a microservice.
 * @param {string} token - The authentication token.
 * @param {string} filePath - The path to the image file to upload.
 * @param {string} microservices - The microservice to upload the image to.
 * @returns {Promise<{ operationId: string, url: string }>} An object containing the operation ID and the URL of the uploaded image.
 */
function uploadImage(token, filePath, microservices) {
    function toCamelCase(str) {
        return str.split(/\s+/)
            .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    function createUploadRequestParam(fileName) {
        return {
            input: {
                fileName
            }
        };
    }

    function createUploadCompleteParam(resourceId, token) {
        return {
            input: {
                resourceId,
                token
            }
        };
    }

    const fileName = filePath.split('/').slice(-1).join('');
    const microservicesToCamelize = toCamelCase(microservices);
    const paramUploadRequest = createUploadRequestParam(fileName);

    function uploadRequest() {
        return {
            mutation: {
                [`uploadRequestFrom${microservicesToCamelize}`]: {
                    __args: paramUploadRequest,
                    resourceId: true,
                    token: true
                }
            }
        };
    }

    return endpoints(token, uploadRequest()).then(responseUploadRequest => {
        const dataUploadRequest = responseUploadRequest.body.data[`uploadRequestFrom${microservicesToCamelize}`];
        expect(dataUploadRequest.hasOwnProperty('resourceId')).toBe(true);

        const url = dataUploadRequest.token;
        const resourceId = dataUploadRequest.resourceId;
        const fileData = fs.readFileSync(filePath);
        return axios({
            method: "put",
            url,
            data: Buffer.from(fileData),
            headers: { "Content-Type": "multipart/form-data", "x-ms-blob-type": "BlockBlob" }
        }).then(responseImage => {
            expect(responseImage.status).toBe(201);
            const paramuploadComplete = createUploadCompleteParam(resourceId, url);

            function uploadComplete() {
                return {
                    mutation: {
                        [`uploadCompleteFrom${microservicesToCamelize}`]: {
                            __args: paramuploadComplete,
                            operationId: true
                        }
                    }
                };
            }

            return endpoints(token, uploadComplete()).then(responseuploadComplete => {
                const dataUploadComplete = responseuploadComplete.body.data[`uploadCompleteFrom${microservicesToCamelize}`];
                expect(dataUploadComplete.hasOwnProperty('operationId')).toBe(true);
                return { operationId: dataUploadComplete.operationId, url };
            });
        });
    });
}

module.exports = { 
    uploadImage
};
