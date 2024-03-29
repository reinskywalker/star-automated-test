/**
 * Author : Andre Reynaldi Lusikooy
 * Converts a string to camel case.
 * @param {string} str - The input string.
 * @returns {string} The camel case version of the input string.
 */
const toCamelCase = (str) => str.split(/\s+/)
    .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

/**
 * Creates a parameter object for upload requests.
 * @param {string} fileName - The name of the file to upload.
 * @returns {Object} The parameter object for the upload request.
 */
const createUploadRequestParam = (fileName) => ({
    input: {
        fileName
    }
});

/**
 * Creates a parameter object for upload completions.
 * @param {string} resourceId - The ID of the uploaded resource.
 * @param {string} token - The token associated with the upload.
 * @returns {Object} The parameter object for the upload completion.
 */
const createUploadCompleteParam = (resourceId, token) => ({
    input: {
        resourceId,
        token
    }
});

/**
 * Uploads an image to a microservice.
 * @param {string} token - The authentication token.
 * @param {string} filePath - The path to the image file to upload.
 * @param {string} microservices - The microservice to upload the image to.
 * @returns {Promise<{ operationId: string, url: string }>} An object containing the operation ID and the URL of the uploaded image.
 */
export const uploadImage = async (token, filePath, microservices) => {
    const fileName = filePath.split('/').slice(-1).join('');
    const microservicesToCamelize = toCamelCase(microservices);
    const paramUploadRequest = createUploadRequestParam(fileName);

    const uploadRequest = () => ({
        mutation: {
            [`uploadRequestFrom${microservicesToCamelize}`]: {
                __args: paramUploadRequest,
                resourceId: true,
                token: true
            }
        }
    });

    const responseUploadRequest = await endpoints(token, uploadRequest());
    const dataUploadRequest = responseUploadRequest.body.data[`uploadRequestFrom${microservicesToCamelize}`];
    expect(dataUploadRequest.hasOwnProperty('resourceId')).toBe(true);

    const url = dataUploadRequest.token;
    const resourceId = dataUploadRequest.resourceId;
    const fileData = fs.readFileSync(filePath);
    const responseImage = await axios({
        method: "put",
        url,
        data: Buffer.from(fileData),
        headers: { "Content-Type": "multipart/form-data", "x-ms-blob-type": "BlockBlob" }
    });

    expect(responseImage.status).toBe(201);
    const paramuploadComplete = createUploadCompleteParam(resourceId, url);

    const uploadComplete = () => ({
        mutation: {
            [`uploadCompleteFrom${microservicesToCamelize}`]: {
                __args: paramuploadComplete,
                operationId: true
            }
        }
    });

    const responseuploadComplete = await endpoints(token, uploadComplete());
    const dataUploadComplete = responseuploadComplete.body.data[`uploadCompleteFrom${microservicesToCamelize}`];

    expect(dataUploadComplete.hasOwnProperty('operationId')).toBe(true);

    return { operationId: dataUploadComplete.operationId, url };
};
