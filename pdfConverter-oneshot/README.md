# PDF Converter - Oneshot

This app + docker image converts PDF pages into JPEG images.

## Features

 - Converts PDF to JPEG
 - Docker Image
 - Moves Completed PDF files to `processed` directory.
 - Saves images in `images` directory.

## Environment Variables

 - INPUT_DIR - the source PDF files
 - OUTPUT_DIR - JPEG files are saved here
 - PROCESSED_DIR - Completed PDF files are moved here
 - RECURSE - whether to recurse (defaults to false)
 - DENSITY - DPI of output image (defaults to 300)
 - JPEG_EXTENT - Max filesize of JPEG (aproximate, defaults to 4MB)

## Usage

```sh
az container create \
    --resource-group $RG \
    --location $ACI_LOCATION \
    --name $ACI_NAME \
    --image $IMAGE \
    --restart-policy OnFailure \
    --azure-file-volume-account-name $STORAGE_ACCOUNT_NAME \
    --azure-file-volume-account-key $STORAGE_KEY \
    --azure-file-volume-share-name $SHARE_NAME \
    --azure-file-volume-mount-path /$FILESHARE/ \
    --environment-variables INPUT_DIR=$INPUT_DIR OUTPUT_DIR=$OUTPUT_DIR PROCESSED_DIR=$PROCESSED_DIR DENSITY=400 JPEG_EXTENT=4MB
```

## Quickstart

Upload your PDF files into a [Fileshare on Azure Storage](https://docs.microsoft.com/en-us/azure/storage/files/storage-how-to-create-file-share).

Upload your PDF's to file storage. The file paths are important!

Login to Azure CLI

`az login`

If required, edit `/scripts/deploy-oneshot-aci.sh` with the paths for input directory, output directory, and completed directory.

```
PROCESSED_DIR="$FILESHARE/path/to/processed/pdfFilesDirectory/output"
OUTPUT_DIR="$FILESHARE/path/to/images/output"
INPUT_DIR="$FILESHARE/path/to/pdf/input"
```

Then run the container, and mount to your Fileshare

`$ ./scripts/deploy-oneshot-aci.sh RESOURCE_GROUP STORAGE_ACC FILESHARE_NAME southeastasia flanagan89/pdfconverter:oneshot`

Check the logs

```sh
$ az container logs --follow -g RESOURCE_GROUP -n pdfconverteroneshot

-- found:  /fileshare/batch/Unprocessed/myfile.pdf
/fileshare/batch/Unprocessed/myfile has 51 pages
Trying to convert page 0 of /fileshare/batch/Unprocessed/myfile.pdf
Created temporary image at /fileshare/batch/Unprocessed/myfile.jpeg
myfile.jpeg to /fileshare/batch/Images
Trying to convert page 1 of /fileshare/batch/Unprocessed/myfile.pdf
...
```