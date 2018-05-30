#!/bin/sh

set -e

if test "$#" -ne 1; then
    echo "Usage: $0 <rg-name>"
    return 1
fi

RG=$1

# RG=bullclip-machine-learning
ACI_NAME=pdfconverter

az container delete --resource-group $RG --name $ACI_NAME