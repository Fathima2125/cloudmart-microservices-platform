# CloudMart Monitoring and Observability

This phase moves CloudMart from Kubernetes-only monitoring to application-aware monitoring.

## What Was Added

CloudMart services now expose Prometheus metrics at:

```text
/metrics
```

Instrumented services:

```text
auth-service
product-service
cart-service
order-service
notification-service
```

Prometheus discovers them using Helm-managed `ServiceMonitor` resources.

## Metrics Added

Each Node.js service now exports:

```text
cloudmart_http_requests_total
cloudmart_http_request_duration_seconds
cloudmart_nodejs_heap_size_used_bytes
cloudmart_nodejs_eventloop_lag_seconds
cloudmart_process_cpu_user_seconds_total
```

What they mean:

```text
cloudmart_http_requests_total
  Counts HTTP requests by service, method, route, and status code.

cloudmart_http_request_duration_seconds
  Measures request latency. Use histogram_quantile for p95/p99 latency.

cloudmart_nodejs_heap_size_used_bytes
  Shows how much memory Node.js is using inside the app process.

cloudmart_nodejs_eventloop_lag_seconds
  Shows if the Node.js event loop is getting slow or blocked.
```

## ServiceMonitor

ServiceMonitors tell Prometheus:

```text
Scrape /metrics from these Kubernetes Services every 30 seconds.
```

The CloudMart ServiceMonitors are created by:

```text
infra/helm/cloudmart/templates/monitoring/cloudmart-servicemonitors.yaml
```

Your kube-prometheus-stack release is named:

```text
monitoring
```

So the ServiceMonitor label must be:

```yaml
release: monitoring
```

Without that label, Prometheus will ignore the ServiceMonitor.

## Verify From Kubernetes

Check ServiceMonitors:

```bash
kubectl get servicemonitor -n cloudmart
```

Check Prometheus is selecting ServiceMonitors:

```bash
kubectl get prometheus -n monitoring -o yaml | grep -A4 serviceMonitorSelector
```

Check app metrics manually:

```bash
kubectl port-forward -n cloudmart svc/auth-service 15001:5001
curl http://localhost:15001/metrics
```

You should see metrics such as:

```text
cloudmart_http_requests_total
cloudmart_http_request_duration_seconds_bucket
cloudmart_nodejs_heap_size_used_bytes
```

## PromQL Queries

Service availability:

```promql
up{namespace="cloudmart"}
```

Request rate:

```promql
sum by (service) (
  rate(cloudmart_http_requests_total{namespace="cloudmart"}[5m])
)
```

Error rate:

```promql
sum by (service) (
  rate(cloudmart_http_requests_total{namespace="cloudmart", status_code=~"5.."}[5m])
)
```

p95 latency:

```promql
histogram_quantile(
  0.95,
  sum by (le, service) (
    rate(cloudmart_http_request_duration_seconds_bucket{namespace="cloudmart"}[5m])
  )
)
```

Pod memory:

```promql
sum by (pod) (
  container_memory_working_set_bytes{namespace="cloudmart", container!="", image!=""}
)
```

Pod CPU:

```promql
sum by (pod) (
  rate(container_cpu_usage_seconds_total{namespace="cloudmart", container!="", image!=""}[5m])
)
```

Pod restarts:

```promql
sum by (pod) (
  increase(kube_pod_container_status_restarts_total{namespace="cloudmart"}[30m])
)
```

## Grafana Dashboard

A project-specific dashboard is included here:

```text
docs/monitoring/grafana-dashboards/cloudmart-observability-dashboard.json
```

Import it in Grafana:

```text
Grafana UI
  -> Dashboards
  -> New
  -> Import
  -> Upload JSON file
```

Use your Prometheus datasource when prompted.

## Why Dashboard IDs 315 or 1860 May Not Load

Grafana dashboard imports by ID require Grafana to reach Grafana.com from the browser/server. They can fail because:

```text
internet access is blocked
Grafana cannot reach grafana.com
the dashboard ID changed or is outdated
the dashboard expects a different datasource name
the dashboard expects metrics that your cluster does not expose
```

For CloudMart, a custom dashboard is better than generic imported dashboards because it uses your own namespace and application metrics.

## Screenshots To Capture

```text
Prometheus targets showing CloudMart services UP
ServiceMonitor list in cloudmart namespace
Grafana CloudMart Observability dashboard
Request rate panel
Latency panel
Pod CPU and memory panels
Node.js heap/event loop panels
```
