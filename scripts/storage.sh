#!/bin/sh

set -e

if test "$#" -ne 3; then
    echo "Usage: $0 <rg-name> <storage-account-name> <location>"
    return 1
fi

RG=$1
STORAGE_ACCOUNT_NAME=$2
LOCATION=$3


echo "Resource Group: $RG"
echo "Storage Account: $STORAGE_ACCOUNT_NAME"
echo "Storage Account Location: $LOCATION"

az storage account create \
    --resource-group RG \
    --name STORAGE_ACCOUNT_NAME \
    --location LOCATION \
    --sku Standard_LRS
