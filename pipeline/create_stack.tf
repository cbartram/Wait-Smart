# Configure the AWS Provider (the access_key_id and secret_access_key are provided via env vars)
provider "aws" {
  region = "us-east-1"
}

# Terraform Variables used in releasing lambda functions
variable "aws_region" {
  default = "us-east-1"
}

variable "lambda_function_name" {
  type = "map"
  default = {
    "DEV" = "WaitSmart-API-dev"
    "PROD" = "WaitSmart-API-prod"
  }
}

variable "api_arn" {
  type = "map"
  default = {
    "DEV" = "arn:aws:execute-api:us-east-1:563409647327:a9y4qru7dg/*/*/*"
    "PROD" = "arn:aws:execute-api:us-east-1:563409647327:2147bwmah5/*/*/*" # TODO This needs updated
  }
}

# Placeholder variables which hold terraform secrets
variable "APP_ENV" {
  default = ""
}
variable "ACCESS_KEY_ID" {
  default = ""
}
variable "CLIENT_ID" {
  default = ""
}
variable "CLIENT_SECRET" {
  default = ""
}
variable "NO_CACHE" {
  default = "true"
}
variable "BUCKET" {
  default = "ignite-artifacts"
}
variable "DEBUG" {
  default = "true"
}
variable "DYNAMODB_TABLE_NAME" {
  default = "WaitSmart-Dev"
}
variable "APP_VERSION" {
  default = ""
}

# Create the API Lambda function
resource "aws_lambda_function" "create_api_lambda" {
  function_name = "${lookup(var.lambda_function_name, var.APP_ENV)}"
  handler = "index.handler"
  role = "arn:aws:iam::563409647327:role/lambda_basic_execution"
  runtime = "nodejs12.x"
  description = "Backend API Lambda function for the WaitSmart Application"
  memory_size = "128"
  timeout = "20"
  s3_bucket = "ignite-artifacts-us-east-1"
  s3_key = "${var.APP_VERSION}"
//  source_code_hash = "${filebase64sha256("../api.zip")}"
//  filename = "../api.zip"
  environment {
    variables {
      ACCESS_KEY_ID = "${var.ACCESS_KEY_ID}"
      CLIENT_ID = "${var.CLIENT_ID}"
      CLIENT_SECRET = "${var.CLIENT_SECRET}"
      NO_CACHE = "${var.NO_CACHE}"
      BUCKET = "${var.BUCKET}"
      DEBUG = "true"
      DYNAMODB_TABLE_NAME = "${var.DYNAMODB_TABLE_NAME}"
    }
  }
}

# Generates a random IAM policy statement id
resource "random_id" "iam_policy" {
  byte_length = 8
}

# Allow for API Gateway to Invoke our Lambda function
resource "aws_lambda_permission" "apigw" {
  statement_id  = "${random_id.iam_policy.dec}"
  action        = "lambda:InvokeFunction"
  function_name = "${lookup(var.lambda_function_name, var.APP_ENV)}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${lookup(var.api_arn, var.APP_ENV)}"
}