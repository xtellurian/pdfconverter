FROM ubuntu:16.04

#update packages
RUN apt-get -qq update
# install prereqs for pdfimage
RUN apt-get -y install imagemagick ghostscript poppler-utils

# Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install --yes nodejs

RUN npm install pdf-image

RUN npm install express


WORKDIR /work

COPY . .

RUN ["chmod", "+x", "./entry.sh"]

ENTRYPOINT [ "./entry.sh"]
