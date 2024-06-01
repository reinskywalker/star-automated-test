const sharp = require('sharp');
const fs = require('fs');

function imageBlobFileGenerator(quality, outputPath = 'data/images/image.jpeg') {
    const adjustedQuality = Math.max(1, Math.min(10, quality)) * 10; 

    sharp(inputURL)
        .jpeg({ quality: adjustedQuality }) 
        .toFile(outputPath, (err, info) => {
            if (err) {
                console.error('Error processing the image:', err);
                return;
            }
            console.log('Image successfully saved with the following details:', info);
        });
}

module.exports = {imageBlobFileGenerator}