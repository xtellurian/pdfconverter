# PDF Converter - Oneshot

This app + docker image converts PDF pages into JPEG images.

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