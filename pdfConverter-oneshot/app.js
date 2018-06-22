// configure dotenv file.
require('dotenv').config()

const path = require('path'), fs = require('fs');
const mv = require('mv');
var PDFImage = require("pdf-image").PDFImage;

// get variables from environment
var startDir = process.env.INPUT_DIR;
var outputDir = process.env.OUTPUT_DIR;
var processedDir = process.env.PROCESSED_DIR;
var recurse = process.env.RECURSE;
var density = process.env.DENSITY;
var jpegMaxFileSize = process.env.JPEG_EXTENT;

// used to make directories when they don't exist
var makedir = true;

// density
if(!density || !Number(density)){
  density = 300; // default to 300
}
density = Number(density); // make sure its a number

if(!jpegMaxFileSize) {
  jpegMaxFileSize = "4MB";
}

async function forEachInDir(startPath, filter, asyncOperation) {
  console.log('Starting from dir ' + startPath + '/');
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory() && recurse) {
      await forEachInDir(filename, filter); //recurse
    }
    else if (filename.indexOf(filter) >= 0) {
      console.log('-- found: ', filename);
      // do something here
      await asyncOperation(filename, outputDir, processedDir);
    };
  };
};


// this get's called on everything matched by forEachInDir
async function convertPdf(pdfPath, outputDir, processedDir) {
  // highest quality = 100
  // density ~~ quality, i.e. pixels per inch / DPI
  // -define jpeg:extent=400KB
  // http://www.imagemagick.org/script/command-line-options.php
  var pdfImage = new PDFImage(pdfPath, {
    convertOptions: {
      "jpeg:extent": jpegMaxFileSize,
      "-density": density
    }
  });

  pdfImage.setConvertExtension("jpeg");

  let numberOfPages = await pdfImage.numberOfPages();

  console.log(`${pdfPath} has ${numberOfPages} pages`);

  for (let page = 0; page < numberOfPages; page++) {
    console.log(`Trying to convert page ${page} of ${pdfPath}`);
    let imagePath = await pdfImage.convertPage(page);
    console.log('Created temporary image at ' + imagePath);
    // move to outputDir
    var imageFileName = path.basename(imagePath);
    console.log(`Moving ${imageFileName} to ${outputDir}`);
    var imageOutputPath = path.join(outputDir, imageFileName);
    mv(imagePath, imageOutputPath, { mkdirp: makedir }, (err) => {
      if(err){
        console.log(`Error moving ${imagePath} to ${imageOutputPath}`);
        console.log(err);
      }
    });
  }

 // done converting images - move PDF to processed dir
  console.log(`Success converting ${pdfPath} . Moving to ${processedDir}`);
  var pdfFileName = path.basename(pdfPath);
  mv(pdfPath, path.join(processedDir, pdfFileName), {mkdirp: makedir}, function (err) {
    if(err){
      console.log(`Error moving ${pdfPath} to processed dir ${processedDir}`)
      console.log(err);
    }
  });
}

// this is the root operation - for each PDF in directory
forEachInDir(startDir, '.pdf', convertPdf).then(() => console.log('DONE!')).catch((err) => {
  console.log('Caught a top level err')
  console.log(err);
});

