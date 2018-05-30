#!/bin/sh

# this script creates a fileshare on an existing storage account
# Requires Azure CLI 

set -e

if test "$#" -ne 3; then
    echo "3 arguments required"
    echo "Usage: $0 <rg-name> <storage-ac-name> <fileshare-name>"
    return 1
fi


RG = $1
STORAGE_ACCOUNT_NAME = $2
ACI_SHARE_NAME = $3

# Export the connection string as an environment variable. The following 'az storage share create' command
# references this environment variable when creating the Azure file share.
export AZURE_STORAGE_CONNECTION_STRING=`az storage account show-connection-string --resource-group $RG --name $STORAGE_ACCOUNT_NAME --output tsv`

# Create the file share
az storage share create -n $ACI_SHARE_NAME