// configure dotenv file.
require('dotenv').config()

const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const blob = require('./azureBlobs');
const pdf = require('./pdfToImage');

// use helmet for security
var app = express();
app.use(helmet());
const Configured_Secret = process.env.SECRET;

app.get(/(blob\/)(.*?\/)(.*\.pdf)\/([0-9]+).png$/i, function (req, res) {
  console.log('serving from blob store');

  var container = req.params[1].replace(/(\/)/, ''); // remove slash in container name
  var pdfPath = req.params[2];
  var pageNumber = req.params[3];
  console.log(`Downloading ${pdfPath} from blob container ${container}`);

  // serve then delete
  blob.download(pdfPath, container)
    .then((info) => pdf.servePdfAsPng(info.path, pageNumber, req, res)
      .then((path) => setTimeout(() => fs.unlink(path,
        () => console.log(`Deleted ${path}`)), 5000, path)) // delete file 5 secnds after its served
      .catch(console.log))
    .catch((err) => res.send(err, 500));
})

app.get(/(volume)(.*\.pdf)\/([0-9]+).png$/i, function (req, res) {
  console.log('Serving from mounted disk');
  let qs = req.query.secret;
  if (qs === Configured_Secret) {
    var pdfPath = req.params[1];
    var pageNumber = req.params[2];

    pdf.servePdfAsPng(pdfPath, pageNumber, req, res)
      .then((path) => setTimeout(() => fs.unlink(path,
        () => console.log(`Deleted ${path}`)), 5000, path)) // delete file 5 secnds after its served
      .catch((err) => res.send(err, 500));
  } else {
    res.send(401);
  }
});

app.listen(3000);

console.log("App is listening on port 3000");
