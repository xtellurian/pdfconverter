const storage = require('azure-storage');
const path = require('path');
const fs = require('fs');

const blobService = storage.createBlobService();
const containerName = 'raw';
const sourceFilePath = path.resolve('./downloads/{NAME}');

const list = () => {
    console.log('calling list');
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

const download = (blobPath) => {
    const downloadFilePath = sourceFilePath.replace('{NAME}', blobPath);
    return new Promise((resolve, reject) => {
        console.log(blobPath);
        console.log(downloadFilePath);
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
