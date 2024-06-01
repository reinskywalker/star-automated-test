const {generateRandomName} = require('../libs/name_generator');

/**
 * Generates a random email address.
 * @returns {string} A randomly generated email address.
 */
function generateRandomEmail() {
    const getName = generateRandomName();
    const domains = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        "icloud.com",
        "aol.com",
        "protonmail.com",
        "zoho.com",
        "yandex.com",
        "mail.com",
        "example.com",
        "domain.com",
        "email.com",
        "inbox.com",
        "rocketmail.com",
        "fastmail.com",
        "tutanota.com",
        "cock.li",
        "guerrillamail.com"
    ];
    const nameWithoutSpaces = getName.replace(/\s/g, '').toLowerCase();
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${nameWithoutSpaces}@${randomDomain}`;
    return email;
}

module.exports = {generateRandomEmail};