var PDFImage = require("pdf-image").PDFImage;
var express = require('express');
var helmet = require('helmet');

// use helmet for security
var app = express();
app.use(helmet());

app.get(/(.*\.pdf)\/([0-9]+).png$/i, function (req, res) {
    var pdfPath = req.params[0];
    var pageNumber = req.params[1];
 
    var pdfImage = new PDFImage(pdfPath);
 
    pdfImage.convertPage(pageNumber).then(function (imagePath) {
      res.sendFile(imagePath);
    }, function (err) {
      res.send(err, 500);
    });
  });
 
app.listen(3000);

console.log("App is listening on port 3000");