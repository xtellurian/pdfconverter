#!/bin/bash

set -e

# RG=bullclip-machine-learning
# STORAGE_ACCOUNT_NAME=bullclipml
# ACI_PERS_SHARE_NAME=dev
# ACI_PERS_LOCATION=southeastasia
#IMAGE=flanagan89/pdfconverter:latest

# Change these four parameters as needed
RG=$1
STORAGE_ACCOUNT_NAME=$2
SHARE_NAME=$3
ACI_LOCATION=$4
IMAGE=$5

if test "$#" -ne 5; then
    echo "5 arguments required"
    echo "Usage: $0 <rg-name> <storage-ac-name> <fileshare-name> <location> <image>"
    return 1
fi

ACI_NAME=pdfconverteroneshot

echo "Resource Group: $RG"
echo "Storage Account: $STORAGE_ACCOUNT_NAME"
echo "File Share Name: $SHARE_NAME"
echo "ACI Location: $ACI_LOCATION"
echo "ACI Name: $ACI_NAME"

# where the Azure File volume will be mounted in container
FILESHARE="/fileshare"
# these are env variables for the container 
PROCESSED_DIR="$FILESHARE/batch/Processed"
OUTPUT_DIR="$FILESHARE/batch/Images"
INPUT_DIR="$FILESHARE/batch/Unprocessed"



# Export the connection string as an environment variable. The following 'az storage share create' command
# references this environment variable when creating the Azure file share.
export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string --resource-group $RG --name $STORAGE_ACCOUNT_NAME --output tsv`

STORAGE_KEY=$(az storage account keys list --resource-group $RG --account-name $STORAGE_ACCOUNT_NAME --query "[0].value" --output tsv)

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