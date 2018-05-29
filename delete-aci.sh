#!/bin/sh

RG=bullclip-machine-learning
ACI_NAME=converter

az container delete --resource-group $RG --name $ACI_NAME