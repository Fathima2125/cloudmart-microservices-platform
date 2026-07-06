# CloudMart Argo CD GitOps

## Argo CD GitOps Deployment

CloudMart uses Argo CD to implement GitOps-based continuous delivery on Amazon EKS.

The CI/CD pipeline builds Docker images for all microservices, scans the source code and Docker images using Trivy, and pushes the approved images to Amazon ECR. Instead of deploying directly to the cluster, GitHub Actions updates the Helm chart image tags in Git.

Argo CD continuously watches the Helm chart stored in the GitHub repository. When a new image tag is committed, Argo CD detects the change and automatically syncs the desired state to the EKS cluster.

This separates CI and CD responsibilities:

- GitHub Actions: build, scan, and push images
- Amazon ECR: store container images
- Argo CD: deploy and reconcile Kubernetes resources
- Amazon EKS: run the CloudMart application


```text
Developer pushes code
  -> GitHub Actions builds/scans images
  -> GitHub Actions pushes images to ECR
  -> GitHub Actions updates Helm image tags in Git
  -> Argo CD detects Git change
  -> Argo CD syncs CloudMart to EKS
```

## Argo CD Application

The Argo CD Application manifest is:

```text
infra/argocd/cloudmart-application.yaml
```

Important settings:

```yaml
repoURL: https://github.com/Fathima2125/ecommerce-platform.git
targetRevision: develop
path: infra/helm/cloudmart
destination:
  namespace: cloudmart
```

The `targetRevision` must match the branch where the Helm chart exists. For the current CloudMart workflow, that branch is:

```text
develop
```

If Argo CD shows:

```text
app path does not exist
```

check that:

```text
repoURL is correct
targetRevision is the correct branch
path is infra/helm/cloudmart
the Helm chart is pushed to that branch
```

## GitHub Actions Change

GitHub Actions no longer runs:

```text
helm upgrade --install
kubectl rollout status
```

Instead, it updates:

```text
infra/helm/cloudmart/values.yaml
```

with the new image tag:

```text
sha-<commit>
```

Argo CD then deploys that Git state to EKS.

## Avoiding Workflow Loops

The workflow ignores tag-only commits to:

```text
infra/helm/cloudmart/values.yaml
```

This prevents GitHub Actions from triggering itself repeatedly after it commits the new image tag.

## Verify Argo CD

Check from CLI:

```bash
kubectl get applications -n argocd
kubectl get application cloudmart -n argocd
kubectl get pods -n cloudmart
```

In the UI, confirm:

```text
cloudmart app is Synced
cloudmart app is Healthy
deployments/services appear in the resource tree
```

## Screenshots To Capture


### Argo CD login page
docs/aws/screenshots/Argo CD login page.png

### CloudMart Application in Argo CD
![alt text](<screenshots/CloudMart Application in Argo CD.png>)

### CloudMart Synced status
![alt text](<screenshots/CloudMart Synced status.png>)

### CloudMart Healthy status
![alt text](<screenshots/CloudMart Healthy status.png>)

### Resource tree showing Deployments and Services
![alt text](<screenshots/Resource tree showing Deployments and Services.png>)

### GitHub Actions image tag commit
![alt text](<screenshots/GitHub Actions image tag commit.png>)

### values.yaml updated with sha-* image tags
![alt text](<screenshots/values.yaml updated with sha-* image tags.png>)