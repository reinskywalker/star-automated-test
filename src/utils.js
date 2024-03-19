const CryptoJS = require('crypto-js');

function envDecoder(env) {
    const setEnv = {};

    for (const key in env) {
        const items = env[key];
        if (Array.isArray(items)) {
            items.forEach((item, index) => {
                const envSuffix = index === 0 ? 'DEV' :
                    index === 1 ? 'UTT' :
                        index === 2 ? 'TRN' :
                            index === 3 ? 'PRE' :
                                'UAT';
                setEnv[`${key}_${envSuffix}`] = item;
            });
        } else {
            setEnv[key] = items;
        }
    }

    return setEnv;
}

function decryptData(encryptedData, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
}

module.exports = { envDecoder, decryptData };
