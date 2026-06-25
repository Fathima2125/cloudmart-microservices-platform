variable "project_name" {
  description = "Project name"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for EKS node group"
  type        = list(string)
}

variable "eks_sg_id" {
  description = "Security group ID for EKS"
  type        = string
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS nodes"
  type        = string
  default     = "t3.medium"
}