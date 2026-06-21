# CloudMart Kubernetes Deployment

## Overview

CloudMart is deployed to Kubernetes as a microservices-based application. This Kubernetes phase moves the project from running containers with Docker Compose to running a cloud-native application with Deployments, Services, ConfigMaps, Secrets, Ingress, health checks, resource limits, and Horizontal Pod Autoscaling.

The Kubernetes manifests are stored in:

```text
infra/kubernetes/
```

The application runs inside the Kubernetes namespace:

```text
cloudmart
```

## Kubernetes Components Implemented

CloudMart currently includes the following Kubernetes components:

```text
Namespace
Deployments
Services
ConfigMaps
Secrets
PersistentVolumeClaim
Ingress
Readiness probes
Liveness probes
Resource requests and limits
Horizontal Pod Autoscalers
Metrics Server
```

## Application Services

The following CloudMart services are deployed to Kubernetes:

| Component | Purpose | Kubernetes Resources |
| --- | --- | --- |
| Frontend | React/Nginx frontend | Deployment, Service, HPA |
| Auth Service | User registration, login, JWT auth | Deployment, Service, ConfigMap, Secret, HPA |
| Product Service | Product listing and product APIs | Deployment, Service, ConfigMap, Secret, HPA |
| Cart Service | User cart management with Redis | Deployment, Service, ConfigMap, Secret, HPA |
| Order Service | Checkout and order creation | Deployment, Service, ConfigMap, Secret, HPA |
| Notification Service | User notifications | Deployment, Service, ConfigMap, Secret, HPA |
| PostgreSQL | Application database | Deployment, Service, ConfigMap, Secret, PVC |
| Redis | Cart/cache storage | Deployment, Service |

PostgreSQL and Redis are deployed inside Kubernetes for local learning. In a production AWS version, these would usually be replaced by managed services such as Amazon RDS and Amazon ElastiCache.

## Folder Structure

```text
infra/kubernetes/
|-- namespace.yaml
|-- auth-service/
|-- product-service/
|-- cart-service/
|-- order-service/
|-- notification-service/
|-- frontend/
|-- postgres/
|-- redis/
|-- ingress/
`-- hpa/
```

Each application service has its own Kubernetes manifests. Most backend services include:

```text
deployment.yaml
service.yaml
configmap.yaml
secret.yaml
```

## Namespace

All CloudMart resources are deployed into the `cloudmart` namespace.

Manifest:

```text
infra/kubernetes/namespace.yaml
```

Apply command:

```bash
kubectl apply -f infra/kubernetes/namespace.yaml
```

## Deployments

Deployments manage CloudMart application pods. If a pod crashes, Kubernetes recreates it automatically.

CloudMart Deployments:

```text
auth-service
product-service
cart-service
order-service
notification-service
frontend
postgres
redis
```

Example deployment behavior:

```text
Deployment
    |
    v
ReplicaSet
    |
    v
Pod
    |
    v
Container
```

Apply deployments:

```bash
kubectl apply -f infra/kubernetes/auth-service/
kubectl apply -f infra/kubernetes/product-service/
kubectl apply -f infra/kubernetes/cart-service/
kubectl apply -f infra/kubernetes/order-service/
kubectl apply -f infra/kubernetes/notification-service/
kubectl apply -f infra/kubernetes/frontend/
```

## Services

Kubernetes Services provide stable networking for pods. Pods can be recreated and receive new IP addresses, but the Service name stays stable.

Example:

```text
auth-service
product-service
cart-service
order-service
notification-service
frontend
postgres-service
redis-service
```

This allows one service to communicate with another using Kubernetes DNS names instead of changing pod IPs.

Example:

```text
order-service -> product-service
cart-service -> redis-service
backend services -> postgres-service
```

## ConfigMaps

ConfigMaps store non-sensitive configuration values.

Examples:

```text
NODE_ENV
PORT
DB_HOST
DB_NAME
REDIS_URL
SERVICE_URLS
```

CloudMart ConfigMaps:

```text
auth-config
product-config
cart-config
order-config
notification-config
postgres-config
```

ConfigMaps help keep configuration outside the container image, which is an important cloud-native practice.

## Secrets

Secrets store sensitive configuration values.

Examples:

```text
DB_PASSWORD
JWT_SECRET
POSTGRES_PASSWORD
INTERNAL_NOTIFICATION_TOKEN
```

CloudMart Secrets:

```text
auth-secret
product-secret
cart-secret
order-secret
notification-secret
postgres-secret
```

Secrets prevent sensitive values from being hardcoded directly inside application code or Docker images.

## PostgreSQL

PostgreSQL is deployed inside Kubernetes for the local learning environment.

PostgreSQL resources:

```text
infra/kubernetes/postgres/postgres-deployment.yaml
infra/kubernetes/postgres/postgres-service.yaml
infra/kubernetes/postgres/postgres-configmap.yaml
infra/kubernetes/postgres/postgres-secret.yaml
infra/kubernetes/postgres/postgres-pvc.yaml
```

The PostgreSQL deployment uses a PersistentVolumeClaim:

```text
postgres-data-pvc
```

This allows database data to persist beyond the lifetime of a single pod.

Important note:

PostgreSQL is not horizontally autoscaled in this local Kubernetes setup. Scaling databases safely requires a different architecture. In the AWS phase, PostgreSQL should move to Amazon RDS.

## Redis

Redis is used by CloudMart for cart/cache storage.

Redis resources:

```text
infra/kubernetes/redis/redis-deployment.yaml
infra/kubernetes/redis/redis-service.yaml
```

In the AWS phase, Redis can be replaced by Amazon ElastiCache.

## Health Checks

CloudMart uses Kubernetes health checks to improve reliability.

Readiness probes answer:

```text
Is this pod ready to receive traffic?
```

Liveness probes answer:

```text
Is this pod still healthy, or should Kubernetes restart it?
```

Backend services use:

```text
/health
```

Frontend uses:

```text
/
```

These probes help Kubernetes detect unhealthy containers and recover automatically.

## Resource Requests and Limits

Resource requests and limits are configured for CloudMart pods.

Requests tell Kubernetes the minimum CPU and memory a container needs.

Limits prevent a container from using too many resources.

Example:

```text
requests:
  cpu: 100m
  memory: 128Mi

limits:
  cpu: 500m
  memory: 512Mi
```

Resource requests are also required for CPU-based Horizontal Pod Autoscaling.

## Ingress

Ingress provides a single entry point into the application.

Ingress manifest:

```text
infra/kubernetes/ingress/cloudmart-ingress.yaml
```

Ingress routes:

| Path | Service |
| --- | --- |
| `/api/v1/auth` | auth-service |
| `/api/v1/products` | product-service |
| `/api/v1/cart` | cart-service |
| `/api/v1/orders` | order-service |
| `/api/notifications` | notification-service |
| `/` | frontend |

Configured hosts:

```text
cloudmart.local
localhost
```

For local testing with the NGINX Ingress Controller:

```bash
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8081:80
```

Then open:

```text
http://localhost:8081
```

If `cloudmart.local` is mapped correctly in the hosts file and the ingress controller is reachable, the application can also be tested with:

```text
http://cloudmart.local
```

## Horizontal Pod Autoscaling

Horizontal Pod Autoscaling is configured for the stateless application services.

HPA manifest:

```text
infra/kubernetes/hpa/cloudmart-hpa.yaml
```

Autoscaled services:

```text
auth-service
product-service
cart-service
order-service
notification-service
frontend
```

HPA settings:

```text
minReplicas: 1
maxReplicas: 3
target CPU utilization: 70%
```

PostgreSQL and Redis are not included in HPA because they are stateful infrastructure components.

Metrics Server is required for HPA:

```bash
minikube addons enable metrics-server
```

Verify HPA:

```bash
kubectl get hpa -n cloudmart
```

## Deployment Commands

Apply all Kubernetes manifests:

```bash
kubectl apply -f infra/kubernetes/namespace.yaml
kubectl apply -f infra/kubernetes/postgres/
kubectl apply -f infra/kubernetes/redis/
kubectl apply -f infra/kubernetes/auth-service/
kubectl apply -f infra/kubernetes/product-service/
kubectl apply -f infra/kubernetes/cart-service/
kubectl apply -f infra/kubernetes/order-service/
kubectl apply -f infra/kubernetes/notification-service/
kubectl apply -f infra/kubernetes/frontend/
kubectl apply -f infra/kubernetes/ingress/
kubectl apply -f infra/kubernetes/hpa/
```

Enable Metrics Server:

```bash
minikube addons enable metrics-server
```

Check Metrics Server:

```bash
kubectl top nodes
kubectl top pods -n cloudmart
```

## Verification Commands

Check pods:

```bash
kubectl get pods -n cloudmart
```

Check services:

```bash
kubectl get svc -n cloudmart
```

Check ingress:

```bash
kubectl get ingress -n cloudmart
```

Check autoscaling:

```bash
kubectl get hpa -n cloudmart
```

Check detailed HPA behavior:

```bash
kubectl describe hpa product-service-hpa -n cloudmart
```

Check logs:

```bash
kubectl logs -n cloudmart deployment/auth-service
kubectl logs -n cloudmart deployment/product-service
kubectl logs -n cloudmart deployment/cart-service
kubectl logs -n cloudmart deployment/order-service
kubectl logs -n cloudmart deployment/notification-service
kubectl logs -n cloudmart deployment/frontend
```

## Screenshot Evidence

The following screenshots were captured to verify the Kubernetes deployment.

### Pods

Command:

```bash
kubectl get pods -n cloudmart
```
Screenshot:

![](<kubernetes-docs/screenshots/kubectl get pods -n cloudmart.png>)



### Services

Command:

```bash
kubectl get svc -n cloudmart
```

Screenshot:

![](<kubernetes-docs/screenshots/kubectl get svc -n cloudmart.png>)

### Ingress

Command:

```bash
kubectl get ingress -n cloudmart
```

Screenshot:

![](<kubernetes-docs/screenshots/kubectl get ingress -n cloudmart.png>)

### HPA

Command:

```bash
kubectl get hpa -n cloudmart
```

Screenshot:

![alt text](<kubernetes-docs/screenshots/kubectl get hpa -n cloudmart.png>)


## Troubleshooting Notes

If HPA shows `<unknown>` for CPU:

```bash
kubectl top nodes
kubectl top pods -n cloudmart
```

If metrics are unavailable, enable Metrics Server:

```bash
minikube addons enable metrics-server
kubectl rollout status deployment/metrics-server -n kube-system
```

If `cloudmart.local` does not open directly, use port forwarding:

```bash
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8081:80
```

Then open:

```text
http://localhost:8081
```

If a pod is not running:

```bash
kubectl describe pod <pod-name> -n cloudmart
kubectl logs <pod-name> -n cloudmart
```

If a deployment needs to be restarted:

```bash
kubectl rollout restart deployment/<deployment-name> -n cloudmart
```

## Kubernetes Phase Summary

This phase completed the core Kubernetes foundation for CloudMart:

```text
Dockerized microservices
Kubernetes deployments
Kubernetes services
ConfigMaps and Secrets
PostgreSQL and Redis in Kubernetes
Health checks
Resource requests and limits
Ingress routing
Horizontal Pod Autoscaling
Metrics Server
```

CloudMart is now ready for the next Kubernetes improvement phase: Helm packaging.

After Helm, the project can move toward AWS deployment with EKS, RDS, ElastiCache, Terraform, GitHub Actions, and monitoring.
