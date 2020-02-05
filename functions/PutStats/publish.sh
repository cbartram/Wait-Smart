#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

LAMBDA_NAME='WaitSmart-PutStats'

echo "${GREEN}=========================${NC}"
echo "${GREEN}|Starting Publish Job...|${NC}"
echo "${GREEN}=========================${NC}"

# Compress the files into a zip archive
echo "${GREEN}[INFO] Compressing source files to archived format${NC}"
zip archive.zip -r -X ./index.js ./package.json ./node_modules

if [[ $? -eq 0 ]]
then
    echo "${GREEN}[INFO] Successfully compressed lambda function code${NC}"
else
    echo "${RED}[ERROR] Failed to compress lambda function code${NC}"
    exit 1
fi

# Update the lambda function code
echo "${GREEN}[INFO] Updating Lambda Function Code${NC}"

aws_command="aws lambda update-function-code --function-name ${LAMBDA_NAME} --zip-file fileb://archive.zip"

eval ${aws_command};

if [[ $? -gt 0 ]]
then
    echo "${RED}[ERROR] Failed to update lambda function code please try again.${NC}"
else
   echo "${GREEN}[INFO] Successfully updated lambda function code${NC}"
fi

# Cleanup and remove zipped files for the next publish job
echo "${GREEN}[INFO] Cleaning up for next build!${NC}"
rm ./archive.zip
echo "${GREEN}[INFO] Done!${NC}"