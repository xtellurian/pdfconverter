var PDFImage = require("pdf-image").PDFImage;
var express = require('express')
var app = express()

// var pdfImage = new PDFImage("/tmp/AECOM-00001.pdf");
// pdfImage.convertPage(0).then(function (imagePath) {
//   // 0-th page (first page) of the slide.pdf is available as slide-0.png
//   fs.existsSync("/tmp/slide-0.png") // => true
// });

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
 
app.listen(3000)