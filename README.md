# Pdf Converter

Pdf Converter is a container to convert PDF to PNG.

It will serve PNG images of PDF files on the file system. Using ACI enables mounting of Azure Storage File Share into the container, meaning we can directly convert from a PDF in Azure Storage to PNG.

## Usage

Your PNG will be served at `<your-ip-or-url>:5000/data-dir/path-to-file-in-fileshare/<page-number>.png?secret=1234&width=XXX&height=YYYY`

The height and width query params are optional.

The secret is not optional. It defaults to 1234, but will be set as a random string if you use the `./scripts/create-aci.sh` script.

## Build the docker image

You must have docker installed to build the image locally.

```sh
cd pdfConverter
docker build -t <your-tag> .
```

Run the container locally:

`docker run -p 8000:8000 <your-tag>`

You'll see a static image served at:

`http://localhost:3000/static-files/test.pdf/0.png?secret=1234`

## Deploy to Azure Container Instance

### Azure CLI

[Download](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) and install the Azure CLI.

### Clone repository

Clone this repository

`git clone <this.url>`

### Authenticate the Azure CLI

[Log into your Azure subscription](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest).

`az login`

Set your subscription

`az account set --subscription SUBSCRIPTION_ID`

> Hint: See your subscriptions with `az account list`

### Enable Container Instances

Container Instances must be enabled on the subscription. Do that with `az provider register --namespace Microsoft.ContainerInstance`

### Create a Resource Group

If you have an existing Resource Group, you can skip this step.

Create an Azure [Resource Group](https://docs.microsoft.com/en-us/azure/architecture/cloud-adoption-guide/adoption-intro/resource-group-explainer) with the following command

`az group create --location <location> --name <rg-name>`

> Hint: You can view available locations with `az account list-locations`

### Create a storage account

`./scripts/storage.sh <rg-name> <storage-account-name> <location>`

### Enable file share on the storage account

`./scripts/fileshare <rg-name> <storage-ac-name> <fileshare-name>`

### Deploy ACI Container

`./scripts/create-aci.sh <rg-name> <storage-ac-name> <fileshare-name> <location>`
