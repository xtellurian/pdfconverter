#!/bin/sh
set -e

# RG=bullclip-machine-learning
# STORAGE_ACCOUNT_NAME=bullclipml
# ACI_PERS_SHARE_NAME=dev
# ACI_PERS_LOCATION=southeastasia

# Change these four parameters as needed
RG=$1
STORAGE_ACCOUNT_NAME=$2
SHARE_NAME=$3
ACI_LOCATION=$4

if test "$#" -ne 4; then
    echo "4 arguments required"
    echo "Usage: $0 <rg-name> <storage-ac-name> <fileshare-name> <location>"
    return 1
fi

ACI_NAME=pdfconverter

echo "Resource Group: $RG"
echo "Storage Account: $STORAGE_ACCOUNT_NAME"
echo "File Share Name: $SHARE_NAME"
echo "ACI Location: $ACI_LOCATION"
echo "ACI Name: $ACI_NAME"

# Export the connection string as an environment variable. The following 'az storage share create' command
# references this environment variable when creating the Azure file share.
# export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string --resource-group $RG --name $STORAGE_ACCOUNT_NAME --output tsv`

STORAGE_KEY=$(az storage account keys list --resource-group $RG --account-name $STORAGE_ACCOUNT_NAME --query "[0].value" --output tsv)

az container create \
    --resource-group $RG \
    --location $ACI_LOCATION \
    --name $ACI_NAME \
    --image flanagan89/pdfconverter:v2 \
    --dns-name-label bullclip-pdfconverter-v1 \
    --ports 80 3000 \
    --azure-file-volume-account-name $STORAGE_ACCOUNT_NAME \
    --azure-file-volume-account-key $STORAGE_KEY \
    --azure-file-volume-share-name $SHARE_NAME \
    --azure-file-volume-mount-path /data-dir/