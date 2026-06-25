output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}

output "eks_sg_id" {
  value = module.security_groups.eks_sg_id
}

output "rds_sg_id" {
  value = module.security_groups.rds_sg_id
}

output "redis_sg_id" {
  value = module.security_groups.redis_sg_id
}