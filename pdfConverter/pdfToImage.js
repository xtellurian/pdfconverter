var PDFImage = require("pdf-image").PDFImage;
const sharp = require('sharp');

function servePdfAsPng(pdfPath, pageNumber, req, res) {
    return new Promise((resolve, reject) => {
        console.log(`Serving file ${pdfPath} as PNG`);
        var pdfImage = new PDFImage(pdfPath);
        pdfImage.convertPage(pageNumber).then(function (imagePath) {
            let width = Number(req.query.width);
            let height = Number(req.query.height);
            if (width || height) {
                if (!width)
                    width = null;
                if (!height)
                    height = null;
                sharp(imagePath)
                    .resize(width, height)
                    .max()
                    .toFormat('png')
                    .toBuffer()
                    .then(function (outputBuffer) {
                        // outputBuffer contains JPEG image data no wider than width pixels and no higher
                        // than height pixels regardless of the inputBuffer image dimensions
                        res.writeHead(200, {
                            'Content-Type': 'image/png',
                            'Content-Length': outputBuffer.length
                        });
                        res.end(outputBuffer);
                    });
            }
            else {
                // send without resizing
                console.log(`Sending ${imagePath} original size`);
                res.sendFile(imagePath);
            }
            resolve(imagePath);
        }, function (err) {
            reject(err);
        });
    });

}

module.exports = {
    servePdfAsPng: servePdfAsPng
}
