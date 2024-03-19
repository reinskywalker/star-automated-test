const fs = require('fs');
const { envDecoder, decryptData } = require('./utils');

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

module.exports = { writeFileEncrypted };
