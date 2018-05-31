const storage = require('azure-storage');
const path = require('path');
const fs = require('fs');

var blobService; // variable for the service
const sourceFilePath = path.resolve('./downloads/{NAME}');

if(process.env.AZURE_STORAGE_CONNECTION_STRING){
    blobService = storage.createBlobService();
} else{
    console.log('No Connection String to Azure Storage');
}

const list = (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmented(containerName, null, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve({ message: `Items in container '${containerName}':`, data: data });
            }
        });
    });
};

const download = (blobPath, containerName) => {
    const downloadFilePath = sourceFilePath.replace('{NAME}', blobPath);
    var dir = path.dirname(downloadFilePath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    return new Promise((resolve, reject) => {
        blobService.getBlobToLocalFile(containerName, blobPath, downloadFilePath, err => {
            if(err) {
                reject(err);
            } else {
                resolve({ message: `Download of '${blobPath}' complete` , path: downloadFilePath});
            }
        });
    });
};


module.exports = {
    download: download,
    list: list
}
