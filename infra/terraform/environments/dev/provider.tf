terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket         = "cloudmart-terraform-state-506098131053"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "cloudmart-terraform-locks"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}