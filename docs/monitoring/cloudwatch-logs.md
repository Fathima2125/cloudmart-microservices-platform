# CloudMart CloudWatch Logs Integration

This phase sends Kubernetes pod logs from EKS to Amazon CloudWatch Logs.

## Goal

Prometheus and Grafana monitor metrics.

CloudWatch stores logs.

```text
CloudMart Pods
      |
      v
aws-for-fluent-bit DaemonSet
      |
      v
CloudWatch Logs
      |
      v
/aws/eks/cloudmart/application
```

## What Was Implemented

Terraform creates:

```text
CloudWatch log group: /aws/eks/cloudmart/application
IAM policy: cloudmart-fluent-bit-cloudwatch-policy
```

Kubernetes runs:

```text
aws-for-fluent-bit DaemonSet
```

IRSA connects the Kubernetes service account to the AWS IAM policy.

```text
amazon-cloudwatch/aws-for-fluent-bit
      |
      v
IAM role
      |
      v
cloudmart-fluent-bit-cloudwatch-policy
```

## Files Added Or Updated

```text
infra/terraform/modules/logging/main.tf
infra/terraform/modules/logging/variables.tf
infra/terraform/modules/logging/outputs.tf
infra/terraform/environments/dev/main.tf
infra/terraform/environments/dev/variables.tf
infra/terraform/environments/dev/outputs.tf
infra/terraform/environments/dev/terraform.tfvars
infra/kubernetes/cloudwatch/aws-for-fluent-bit-values.yaml
```

## Terraform

Run:

```bash
terraform -chdir=infra/terraform/environments/dev init
terraform -chdir=infra/terraform/environments/dev validate
terraform -chdir=infra/terraform/environments/dev apply
```

Important outputs:

```text
cloudwatch_log_group_name
fluent_bit_cloudwatch_policy_arn
```

Expected:

```text
cloudwatch_log_group_name = "/aws/eks/cloudmart/application"
fluent_bit_cloudwatch_policy_arn = "arn:aws:iam::506098131053:policy/cloudmart-fluent-bit-cloudwatch-policy"
```

## Create IRSA Service Account

```bash
kubectl create namespace amazon-cloudwatch --dry-run=client -o yaml | kubectl apply -f -
```

```bash
eksctl create iamserviceaccount \
  --cluster cloudmart-eks-cluster \
  --namespace amazon-cloudwatch \
  --name aws-for-fluent-bit \
  --attach-policy-arn arn:aws:iam::506098131053:policy/cloudmart-fluent-bit-cloudwatch-policy \
  --override-existing-serviceaccounts \
  --region us-east-1 \
  --approve
```

Verify:

```bash
kubectl get serviceaccount aws-for-fluent-bit \
  -n amazon-cloudwatch \
  -o yaml
```

Look for:

```text
eks.amazonaws.com/role-arn
```

## Install aws-for-fluent-bit

```bash
helm repo add aws https://aws.github.io/eks-charts
helm repo update aws
```

```bash
helm upgrade --install aws-for-fluent-bit aws/aws-for-fluent-bit \
  -n amazon-cloudwatch \
  -f infra/kubernetes/cloudwatch/aws-for-fluent-bit-values.yaml
```

Wait:

```bash
kubectl rollout status daemonset/aws-for-fluent-bit \
  -n amazon-cloudwatch \
  --timeout=180s
```

## Verify In Kubernetes

```bash
kubectl get pods -n amazon-cloudwatch -o wide
```

Expected:

```text
aws-for-fluent-bit-xxxxx   1/1   Running
```

Check logs:

```bash
kubectl logs -n amazon-cloudwatch daemonset/aws-for-fluent-bit --tail=120
```

Look for messages like:

```text
output:cloudwatch_logs
Creating log stream
Created log stream
```

## Verify In CloudWatch

Check log group:

```bash
aws logs describe-log-groups \
  --log-group-name-prefix /aws/eks/cloudmart/application \
  --region us-east-1
```

List CloudMart log streams:

```bash
aws logs describe-log-streams \
  --log-group-name /aws/eks/cloudmart/application \
  --region us-east-1 \
  --log-stream-name-prefix cloudmart-kube.var.log.containers \
  --max-items 100 \
  --query 'logStreams[?contains(logStreamName, `_cloudmart_`)].logStreamName' \
  --output text
```

Fetch sample product-service logs:

```bash
STREAM=$(aws logs describe-log-streams \
  --log-group-name /aws/eks/cloudmart/application \
  --region us-east-1 \
  --log-stream-name-prefix cloudmart-kube.var.log.containers \
  --max-items 100 \
  --query 'logStreams[?contains(logStreamName, `_cloudmart_`) && contains(logStreamName, `product-service`)].logStreamName | [0]' \
  --output text)

aws logs get-log-events \
  --log-group-name /aws/eks/cloudmart/application \
  --log-stream-name "$STREAM" \
  --region us-east-1 \
  --limit 5 \
  --query 'events[].message' \
  --output text
```

Expected log example:

```text
Redis Connected
namespace_name: cloudmart
container_name: product-service
```

## AWS Console

Open:

```text
CloudWatch
  -> Logs
  -> Log groups
  -> /aws/eks/cloudmart/application
```

You should see log streams for pods such as:

```text
frontend
product-service
cart-service
order-service
notification-service
auth-service
```

## Screenshots To Capture

Take screenshots of:

```text
1. Terraform apply output showing CloudWatch log group and IAM policy
2. kubectl get pods -n amazon-cloudwatch -o wide
3. kubectl get serviceaccount aws-for-fluent-bit -n amazon-cloudwatch -o yaml
4. kubectl logs -n amazon-cloudwatch daemonset/aws-for-fluent-bit --tail=120
5. AWS CloudWatch log group: /aws/eks/cloudmart/application
6. CloudWatch log streams showing CloudMart pods
7. Sample product-service log event in CloudWatch
```

For the service account screenshot, show:

```text
eks.amazonaws.com/role-arn
```

For the CloudWatch sample event screenshot, show Kubernetes metadata:

```text
namespace_name: cloudmart
pod_name
container_name
container_image
```

## What To Say In README

```text
Integrated Amazon CloudWatch Logs with CloudMart on EKS using aws-for-fluent-bit. Pod logs are collected from EKS worker nodes and shipped to the CloudWatch log group /aws/eks/cloudmart/application. IAM permissions are provided using IRSA, so no AWS access keys are stored in Kubernetes. Logs include Kubernetes metadata such as namespace, pod name, container name, and container image.
```

