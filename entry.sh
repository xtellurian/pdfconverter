#!/bin/sh

echo "ran entry.sh"

echo "this is a test file from MY CONTAINER" > /data-dir/test.txt

node ./app.js