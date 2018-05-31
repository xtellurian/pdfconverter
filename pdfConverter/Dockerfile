FROM ubuntu:16.04

#update packages
RUN apt-get -qq update
# install prereqs for pdfimage
RUN apt-get -y install imagemagick ghostscript poppler-utils

# Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install --yes nodejs

# make sure there's a downloads dir
RUN mkdir downloads && chmod -R 777 downloads
# copy everything into workdir
COPY . .

# install dependencies from package.json
RUN npm install

ENTRYPOINT [ "node", "./app.js"]
