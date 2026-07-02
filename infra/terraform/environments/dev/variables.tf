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

variable "github_actions_role_arn" {
  description = "IAM role ARN used by GitHub Actions OIDC to deploy CloudMart"
  type        = string
  default     = ""
}

variable "monitoring_alert_email" {
  description = "Email address subscribed to CloudMart monitoring alerts"
  type        = string
}

variable "cloudwatch_log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}
