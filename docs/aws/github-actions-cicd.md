# CloudMart GitHub Actions CI/CD

This phase automates the CloudMart deployment flow:

```text
Git push
  -> GitHub Actions
  -> Build Docker images
  -> Push images to Amazon ECR
  -> Deploy updated Helm release to Amazon EKS
  -> Verify Kubernetes rollouts
```

## Prerequisites

Before running the workflow, the AWS infrastructure should already exist:

- ECR repositories for all six app images
- EKS cluster
- RDS PostgreSQL
- ElastiCache Redis
- CloudMart Helm chart configured for AWS

The workflow file is:

```text
.github/workflows/cloudmart-ci-cd.yml
```

## GitHub OIDC Authentication

CloudMart uses GitHub OIDC to authenticate to AWS. This avoids storing long-term AWS access keys in GitHub.

Add this secret in GitHub:

```text
AWS_ROLE_TO_ASSUME
```

Path:

```text
GitHub repository
  -> Settings
  -> Secrets and variables
  -> Actions
  -> New repository secret
```

Example value:

```text
arn:aws:iam::506098131053:role/cloudmart-github-actions-oidc-role
```

The AWS role used by this secret needs permission to:

- Login to Amazon ECR
- Push images to ECR
- Run `aws eks update-kubeconfig`
- Deploy to the EKS cluster with Helm/kubectl

The workflow also needs this permission block so GitHub can request an OIDC token:

```yaml
permissions:
  id-token: write
  contents: read
```

## Images Built By The Workflow

The workflow builds and pushes:

```text
cloudmart-auth-service
cloudmart-product-service
cloudmart-cart-service
cloudmart-order-service
cloudmart-notification-service
cloudmart-frontend
```

Each image gets two tags:

```text
latest
sha-<git-commit-short-sha>
```

Example:

```text
cloudmart-frontend:latest
cloudmart-frontend:sha-a1b2c3d
```

The Helm deployment uses the commit-based tag. This makes the running version traceable to a specific Git commit.

## Helm Image Configuration

The Helm chart now reads image repositories and tags from:

```text
infra/helm/cloudmart/values.yaml
```

Example:

```yaml
images:
  frontend:
    repository: 506098131053.dkr.ecr.us-east-1.amazonaws.com/cloudmart-frontend
    tag: latest
    pullPolicy: Always
```

GitHub Actions overrides the image tags during deployment:

```bash
helm upgrade --install cloudmart ./infra/helm/cloudmart \
  --namespace cloudmart \
  --create-namespace \
  --set images.authService.tag="$IMAGE_TAG" \
  --set images.productService.tag="$IMAGE_TAG" \
  --set images.cartService.tag="$IMAGE_TAG" \
  --set images.orderService.tag="$IMAGE_TAG" \
  --set images.notificationService.tag="$IMAGE_TAG" \
  --set images.frontend.tag="$IMAGE_TAG"
```

## How To Run

Push code to GitHub:

```bash
git add .
git commit -m "Add GitHub Actions CI/CD"
git push
```

Or run it manually:

```text
GitHub repository
  -> Actions
  -> CloudMart CI/CD
  -> Run workflow
```

## Verify Deployment

After the workflow finishes, verify from your laptop:

```bash
kubectl get pods -n cloudmart
kubectl get svc -n cloudmart
helm status cloudmart -n cloudmart
kubectl get ingress -n cloudmart
```

If ALB ingress is applied, test:

```bash
curl http://<ALB-DNS-NAME>/api/v1/products
```

## Screenshots To Capture

Useful screenshots for README/project documentation:

```text
GitHub Actions workflow success page
Build and push Docker images step
Deploy CloudMart to EKS step
Verify rollouts step
Amazon ECR repositories showing new image tags
kubectl get pods -n cloudmart
helm status cloudmart -n cloudmart
CloudMart website running through ALB
```

## Important Note

This workflow expects the AWS infrastructure to be running. If you run `terraform destroy`, the workflow cannot deploy until you run `terraform apply` again and recreate the required EKS/RDS/Redis resources.
