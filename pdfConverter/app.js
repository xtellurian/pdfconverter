var PDFImage = require("pdf-image").PDFImage;
const sharp = require('sharp');
var express = require('express');
var helmet = require('helmet');

// configure dotenv file.
require('dotenv').config()

// use helmet for security
var app = express();
app.use(helmet());
const Configured_Secret = process.env.SECRET;

app.get(/(.*\.pdf)\/([0-9]+).png$/i, function (req, res) {
  let qs = req.query.secret;
  if (qs === Configured_Secret) {
    var pdfPath = req.params[0];
    var pageNumber = req.params[1];

    var pdfImage = new PDFImage(pdfPath);

    pdfImage.convertPage(pageNumber).then(function (imagePath) {
      let width = Number(req.query.width);
      let height = Number(req.query.height);
      if(width || height) {
        if(!width) width = null;
        if(!height) height = null;
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
        res.sendFile(imagePath);
      }
    }, function (err) {
      res.send(err, 500);
    });
  } else {
    res.send(401);
  }
});

app.listen(3000);

console.log("App is listening on port 3000");