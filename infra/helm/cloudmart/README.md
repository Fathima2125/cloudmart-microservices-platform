# CloudMart Helm Chart

This chart packages the CloudMart Kubernetes manifests so the application can be installed and upgraded with Helm.

## Install

For a clean namespace:

```bash
kubectl create namespace cloudmart
helm upgrade --install cloudmart ./infra/helm/cloudmart -n cloudmart
```

If the namespace does not already exist:

```bash
helm upgrade --install cloudmart ./infra/helm/cloudmart -n cloudmart --create-namespace
```

## Verify

```bash
helm list -n cloudmart
kubectl get pods -n cloudmart
kubectl get svc -n cloudmart
kubectl get ingress -n cloudmart
kubectl get hpa -n cloudmart
```

## Important Migration Note

If CloudMart was already deployed with raw Kubernetes manifests using `kubectl apply`, Helm cannot install the same resources until they are either removed or adopted into the Helm release.

The error looks like this:

```text
invalid ownership metadata;
missing key "app.kubernetes.io/managed-by": must be set to "Helm";
missing key "meta.helm.sh/release-name": must be set to "cloudmart";
missing key "meta.helm.sh/release-namespace": must be set to "cloudmart"
```

This happens because Helm protects existing Kubernetes resources from being accidentally taken over by a release.

For this project, the existing `cloudmart` resources were adopted into the Helm release by adding the required Helm ownership labels and annotations.

## Namespace Handling

The chart does not include a `Namespace` template. The namespace is managed outside the chart with:

```bash
kubectl create namespace cloudmart
```

or with Helm:

```bash
helm upgrade --install cloudmart ./infra/helm/cloudmart -n cloudmart --create-namespace
```

Templates use the Helm release namespace:

```text
{{ .Release.Namespace }}
```

This keeps the chart reusable and avoids hardcoding `cloudmart` inside every manifest.


### Screenshots
-  helm lint ./infra/helm/cloudmart

 ![](<screenshots/helm lint .:infra:helm:cloudmart.png>)

- helm list -n cloudmart

![](<screenshots/helm list -n cloudmart.png>)

- helm status cloudmart -n cloudmart

![](<screenshots/helm status cloudmart -n cloudmart.png>)

- kubectl get pods -n cloudmart

![alt text](<screenshots/kubectl get pods -n cloudmart.png>)

- kubectl top pods -n cloudmart

![alt text](<screenshots/kubectl top pods -n cloudmart.png>)

- helm history cloudmart -n cloudmart

![alt text](<screenshots/helm history cloudmart -n cloudmart.png>)