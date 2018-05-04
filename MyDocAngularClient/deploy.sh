#/bin/bash
#upload files
aws s3 cp ./dist s3://mydoc-angular-client --recursive --acl public-read
