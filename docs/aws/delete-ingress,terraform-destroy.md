## To Stop Cost Tonight

### Delete only the ALB Ingress:

kubectl delete -f infra/kubernetes/aws-ingress/cloudmart-alb-ingress.yaml

### Then confirm the ALB is gone:

kubectl get ingress -n cloudmart

### You should no longer see:

cloudmart-alb-ingress

## Also check AWS:

aws elbv2 describe-load-balancers --region us-east-1

Wait a few minutes if it still appears, because AWS takes time to delete ALBs.

If you are done for the day and want to remove AWS infrastructure too:

cd infra/terraform/environments/dev

terraform destroy

## Tomorrow Flow

From project root:
cd infra/terraform/environments/dev

terraform apply

Then update kubeconfig if needed:
```
aws eks update-kubeconfig \
  --region us-east-1 \
  --name cloudmart-eks-cluster
  ```

#### Check cluster:
```
kubectl get nodes
```

### Then deploy CloudMart:
```
helm upgrade --install cloudmart ./infra/helm/cloudmart -n cloudmart --create-namespace
```

### Then install/fix AWS Load Balancer Controller again if Terraform destroy removed the cluster:
```
eksctl utils associate-iam-oidc-provider \
  --region us-east-1 \
  --cluster cloudmart-eks-cluster \
  --approve
  ```
  ```
eksctl create iamserviceaccount \
  --cluster cloudmart-eks-cluster \
  --namespace kube-system \
  --name aws-load-balancer-controller \
  --attach-policy-arn arn:aws:iam::506098131053:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --region us-east-1 \
  --approve
  ```
  ````
helm repo add eks https://aws.github.io/eks-charts
helm repo update eks
helm upgrade --install aws-load-balancer-controller eks/
```
```
aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=cloudmart-eks-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=us-east-1 \
  --set vpcId=$(terraform -chdir=infra/terraform/environments/dev output -raw vpc_id) \
  --version 1.14.0
  ````

### Verify:
```
kubectl get deployment -n kube-system aws-load-balancer-controller
```

### Then recreate ALB Ingress:
```
kubectl apply -f infra/kubernetes/aws-ingress/cloudmart-alb-ingress.yaml
```
### Check:
```
kubectl get ingress -n cloudmart
```
Wait until ADDRESS appears, then open the ALB URL.
#### Small note: if you run full terraform destroy, RDS will also be destroyed, so tomorrow you must run init.sql again into the fresh RDS database.

after terraform apply, EKS is ready, and CloudMart namespace exists, run init.sql into the new RDS like this.

From project root:
cd /Users/fathimayosraajeeb/Desktop/ecommerce-platform
### Create the SQL ConfigMap:
```
kubectl create configmap cloudmart-init-sql \
  --from-file=init.sql=init.sql \
  -n cloudmart \
  --dry-run=client -o yaml | kubectl apply -f -
  ```
### Create a temporary secret from your Terraform DB values:
 ```
 DB_NAME=$(terraform -chdir=infra/terraform/environments/dev output -raw rds_db_name)

DB_USER=$(awk -F= '/db_username/{gsub(/[ "]/,"",$2); print $2}' infra/terraform/environments/dev/terraform.tfvars)

DB_PASSWORD=$(awk -F= '/db_password/{gsub(/^[[:space:]]*"|"[[:space:]]*$/,"",$2); print $2}' infra/terraform/environments/dev/terraform.tfvars)

kubectl create secret generic rds-init-secret \
  -n cloudmart \
  --from-literal=DB_NAME="$DB_NAME" \
  --from-literal=DB_USER="$DB_USER" \
  --from-literal=DB_PASSWORD="$DB_PASSWORD" \
  --dry-run=client -o yaml | kubectl apply -f -
  ```

#### Make sure your RDS init job uses the new RDS endpoint. If Terraform recreated RDS, get it:
```
terraform -chdir=infra/terraform/environments/dev output -raw rds_endpoint
```

If needed, update this file:
infra/kubernetes/jobs/rds-init-job.yaml

Then run:
```
kubectl delete job cloudmart-rds-init -n cloudmart --ignore-not-found
```

```
kubectl apply -f infra/kubernetes/jobs/rds-init-job.yaml 
```
### Wait for completion:
```
kubectl wait --for=condition=complete job/cloudmart-rds-init -n cloudmart --timeout=120s 
```
### Check logs:
```
kubectl logs job/cloudmart-rds-init -n cloudmart
```
Expected output includes:
CREATE TABLE
INSERT 0 5
INSERT 0 5
### Then clean temporary resources:
```
kubectl delete job cloudmart-rds-init -n cloudmart
kubectl delete configmap cloudmart-init-sql -n cloudmart
kubectl delete secret rds-init-secret -n cloudmart
```
After that, your products/categories are loaded into RDS again.


