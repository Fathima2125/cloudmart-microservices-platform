variable "aws_region" {
  description = "AWS region for CloudMart infrastructure"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}
variable "db_name" {
  description = "CloudMart database name"
  type        = string
}

variable "db_username" {
  description = "CloudMart database username"
  type        = string
}

variable "db_password" {
  description = "CloudMart database password"
  type        = string
  sensitive   = true
}
