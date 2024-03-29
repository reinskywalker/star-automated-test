/**
 * Author : Andre Reynaldi Lusikooy
 * @param {boolean} [includeLastName=false] - Whether to include a last name.
 * @returns {string[]} An array containing the generated first and last names, or just the first name if includeLastName is false.
 */
function generateRandomName(includeLastName = false) {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    
    const minLength = 3;
    const maxLength = 8;
  
    const firstNameLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  
    let firstName = '';
    let lastName = ''; 

    for (let i = 0; i < firstNameLength; i++) {
      const charSet = i % 2 === 0 ? consonants : vowels;
      const randomChar = charSet.charAt(Math.floor(Math.random() * charSet.length));
      if (i === 0) {
        firstName += randomChar.toUpperCase();
      } else {
        firstName += randomChar;
      }
    }
    if (includeLastName) {
      const lastNameLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  
      for (let i = 0; i < lastNameLength; i++) {
        const charSet = i % 2 === 0 ? consonants : vowels;
        const randomChar = charSet.charAt(Math.floor(Math.random() * charSet.length));
        lastName += randomChar;
      }
      lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    }
    return includeLastName ? [firstName, lastName] : [firstName];
}

module.exports = {generateRandomName};
