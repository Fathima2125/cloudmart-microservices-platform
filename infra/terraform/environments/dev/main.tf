module "vpc" {
  source = "../../modules/vpc"

  project_name = var.project_name

  vpc_cidr = "10.0.0.0/16"

  public_subnet_cidrs = [
    "10.0.1.0/24",
    "10.0.2.0/24"
  ]

  private_subnet_cidrs = [
    "10.0.11.0/24",
    "10.0.12.0/24"
  ]

  availability_zones = [
    "us-east-1a",
    "us-east-1b"
  ]
}

module "security_groups" {
  source = "../../modules/security-groups"

  project_name = var.project_name
  vpc_id       = module.vpc.vpc_id
}

module "eks" {
  source = "../../modules/eks"

  project_name       = var.project_name
  subnet_ids         = module.vpc.public_subnet_ids
  eks_sg_id          = module.security_groups.eks_sg_id
  node_instance_type = "t3.medium"
}