## Created security groups for CloudMart:

- EKS security group allows HTTP/HTTPS ingress and outbound traffic.
- RDS security group allows PostgreSQL traffic only from EKS security group.
- Redis security group allows Redis traffic only from EKS security group.


### Screenshots
#### security groups created

![alt text](<screenshots/terraform apply-sg.png>)

### verify in AWS CLI

```
aws ec2 describe-security-groups \
  --filters "Name=tag:Name,Values=cloudmart-eks-sg,cloudmart-rds-sg,cloudmart-redis-sg" \
  --region us-east-1
```

![alt text](<screenshots/aws ec2 describe-security groups.png>)