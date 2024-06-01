const {GraphQLClient} = require('./libs/graphql.endpoints')
const {generateRandomEmail} = require('./libs/email_generator');
const {generateRandomName} = require('./libs/name_generator');
const {uploadImage} = require('./libs/uploadImage');
const {writeFileEncrypted} = require('./libs/writeFileEncrypted');
const {imageBlobFileGenerator} = require('./libs/imageBlobGenerator')

/**
 * Author: Andre Reynaldi Lusikooy
 * Writes decrypted environment data to a file.
 * @param {Object} envObject The environment object to be decrypted and written to the file.
 * @param {string} encryptionKey The encryption key used for decryption.
 */

module.exports = { 
    writeFileEncrypted, 
    GraphQLClient, 
    uploadImage, 
    generateRandomName,
    generateRandomEmail,
    imageBlobFileGenerator
};
