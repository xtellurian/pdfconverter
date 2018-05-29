#!/bin/sh

set -e

# Change these four parameters as needed
RG=bullclip-machine-learning
STORAGE_ACCOUNT=bullclipml
ACI_PERS_LOCATION=eastus
ACI_PERS_SHARE_NAME=fileshare


# Export the connection string as an environment variable. The following 'az storage share create' command
# references this environment variable when creating the Azure file share.
export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string --resource-group $RG --name $STORAGE_ACCOUNT --output tsv`

# Create the file share
az storage share create -n $ACI_PERS_SHARE_NAME

STORAGE_KEY=$(az storage account keys list --resource-group $RG --account-name $STORAGE_ACCOUNT --query "[0].value" --output tsv)
echo $STORAGE_KEY

az container create \
    --resource-group $RG \
    --location southeastasia \
    --name hellofiles \
    --image flanagan89/pdfconverter:v1 \
    --dns-name-label bullclip-pdfconverter-v1 \
    --ports 80 3000 \
    --azure-file-volume-account-name $STORAGE_ACCOUNT \
    --azure-file-volume-account-key $STORAGE_KEY \
    --azure-file-volume-share-name $ACI_PERS_SHARE_NAME \
    --azure-file-volume-mount-path /data-dir/