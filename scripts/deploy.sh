#!/bin/sh
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0;0m'

# ====================================
# Release.sh
# Sets the environment and deploys
# infrastructure to AWS via terraform
# ====================================

TRAVIS_BRANCH=${TRAVIS_BRANCH}

# Setup prod vs dev configurations (this is what needs to be in travis CI)
# --------------- Prod -----------------
BUCKET_PROD=${BUCKET_PROD}
DYNAMODB_TABLE_NAME_PROD=${DYNAMODB_TABLE_NAME_PROD}

# --------------- DEV -----------------
BUCKET_DEV=${BUCKET_DEV}
DYNAMODB_TABLE_NAME_DEV=${DYNAMODB_TABLE_NAME_DEV}

# Used as a source to export the tricky version parsed from the package.json file
# this is used as follows: source ./scripts/setup.sh ... then echo $VERSION prints the env version
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo "$GREEN ------------------------------- $NC"
echo "$GREEN | Creating API Release v$PACKAGE_VERSION | $NC"
echo "$GREEN ------------------------------- $NC"

# Sets up the app env for terraform (dev/prod)
# this determines where terraform deploys to
if [ $TRAVIS_BRANCH = "master" ]; then
    echo "$GREEN[INFO] Using PROD environmental variables $NC"
    APP_ENV="PROD"
    CLIENT_ID=${CLIENT_ID_PROD}
    CLIENT_SECRET=${CLIENT_ID_PROD}
    BUCKET=${BUCKET_PROD}
    DYNAMODB_TABLE_NAME=${DYNAMODB_TABLE_NAME_PROD}
    LAMBDA_FUNCTION_NAME="WaitSmart-API-prod"
else
    echo "$GREEN[INFO] Using DEV environmental variables $NC"
    APP_ENV="DEV"
    CLIENT_ID=${CLIENT_ID_DEV}
    CLIENT_SECRET=${CLIENT_ID_DEV}
    BUCKET=${BUCKET_DEV}
    DYNAMODB_TABLE_NAME="WaitSmart-Dev"
    LAMBDA_FUNCTION_NAME="WaitSmart-API-dev"
fi

export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export NO_CACHE="true"
export DEBUG="true"
export APP_ENV
export PACKAGE_VERSION
export CLIENT_ID
export CLIENT_SECRET
export BUCKET
export DYNAMODB_TABLE_NAME
export LAMBDA_FUNCTION_NAME

echo "$GREEN[INFO] Successfully exported env vars $NC"
echo "$GREEN[INFO] Attempting to write secrets.tfvars file... $NC"

# Write the configured env vars to the /pipeline/secrets.tfvars file
echo "AWS_ACCESS_KEY_ID = \"${AWS_ACCESS_KEY_ID}\"
CLIENT_ID = \"${APP_CLIENT_ID}\"
CLIENT_SECRET = \"${APP_CLIENT_ID}\"
NO_CACHE = \"${NO_CACHE}\"
BUCKET = \"${BUCKET}\"
LAMBDA_FUNCTION_NAME = \"${LAMBDA_FUNCTION_NAME}\"
DEBUG = \"true\"
DYNAMODB_TABLE_NAME = \"${DYNAMODB_TABLE_NAME}\"" > ./pipeline/secrets.tfvars

echo "$GREEN[INFO] secrets.tfvars file written successfully $NC"

# Creates a new release by zipping up source files and publishing them to github and S3
PACKAGE_VERSION=${PACKAGE_VERSION}
GIT_PASS=${GIT_PASS}
APP_ENV=${APP_ENV}

echo "$GREEN[INFO] Preparing Release for Branch: ${TRAVIS_BRANCH} $NC"
echo "$GREEN[INFO] Release Version: ${PACKAGE_VERSION} $NC"
echo "$GREEN[INFO] Deploying to app env: ${APP_ENV} $NC"
echo "$GREEN[INFO] Lambda Function Name: ${LAMBDA_FUNCTION_NAME} $NC"
echo "$GREEN[INFO] Environmental variables: $NC"
cat ./pipeline/secrets.tfvars

echo "$GREEN[INFO] Installing only production node_modules $NC"
rm -rf node_modules
npm install --production

echo "$GREEN[INFO] Compressing source into Artifact... $NC"
zip -r -X api.zip . -x \*.git\* -x \*.idea\* -x \*.env\* -x \*.DS_STORE\* -x \*.scannerwork\* -x \*.nyc_output\* -x \*.dpl\* >/dev/null 2>&1

echo "$GREEN[INFO] Creating directory structure... $NC"
mkdir -p ./artifacts/${TRAVIS_BRANCH}/${PACKAGE_VERSION}

echo "$GREEN[INFO] Copying & renaming compressed source file... $NC"
cp api.zip ./artifacts/${TRAVIS_BRANCH}/${PACKAGE_VERSION}/WaitSmart-API-${PACKAGE_VERSION}.zip

echo "$GREEN[INFO] Syncing Release with S3 $NC"
aws s3 sync ./artifacts s3://ignite-artifacts-us-east-1 --exclude .DS_STORE

if [ $? -gt 0 ]
then
    echo "$RED[ERROR] Failed to Upload Artifact to S3... $NC"
    exit 1
fi

echo "$GREEN[INFO] Tagging Git version: ${PACKAGE_VERSION} $NC"
git tag ${PACKAGE_VERSION}

if [ $? -gt 0 ]
then
    # Try to bump the version and attempt to re-tag it with git
    echo "$YELLOW[WARN] Git Version Already Exists Bumping version... $NC"
    npm run bump
    NEW_PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
    git tag ${NEW_PACKAGE_VERSION}

    if [ $? -gt 0 ]
    then
        echo "$RED[ERROR] Failed to bump & tag new git version.$NC"
        exit 1
    fi
fi

echo "$GREEN[INFO] Publishing git release for version: ${PACKAGE_VERSION}"
git push https://cbartram:${GIT_PASS}@github.com/cbartram/Wait-Smart.git/ --tags

cd ./pipeline || exit
echo "$GREEN[INFO] Deploying Infrastructure with Terraform... $NC"

terraform init -input=false
eval "terraform import aws_lambda_function.create_api_lambda ${LAMBDA_FUNCTION_NAME}"
terraform validate -var-file=secrets.tfvars -var="APP_ENV=${APP_ENV}" -var="APP_VERSION=${TRAVIS_BRANCH}/${PACKAGE_VERSION}/WaitSmart-API-${PACKAGE_VERSION}.zip"
terraform plan -out=tfplan -input=false -var-file=secrets.tfvars -var="APP_ENV=${APP_ENV}" -var="APP_VERSION=${TRAVIS_BRANCH}/${PACKAGE_VERSION}/WaitSmart-API-${PACKAGE_VERSION}.zip"
terraform apply -input=false tfplan

echo "$GREEN[INFO] Cleaning Up... $NC"
cd ..
rm ./api.zip
rm -rf ./artifacts
rm ./pipeline/tfplan
rm ./pipeline/terraform.tfstate
rm ./pipeline/terraform.tfstate.backup

echo "$GREEN[INFO] Done. $NC"