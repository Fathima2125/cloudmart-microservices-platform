# CloudMart Monitoring Roadmap Status

This document tracks what has been completed in the CloudMart monitoring phase and what remains.

## Completed: Prometheus and Grafana

CloudMart now has Kubernetes and application monitoring.

Completed items:

- Installed `kube-prometheus-stack` in the `monitoring` namespace.
- Verified Prometheus, Grafana, Alertmanager, kube-state-metrics, and node-exporter pods.
- Opened Prometheus UI, Grafana UI, and Alertmanager UI using port-forwarding.
- Learned basic PromQL queries such as `up`, `kube_pod_info`, `kube_node_info`, `node_cpu_seconds_total`, and memory metrics.
- Added `prom-client` instrumentation to all backend Node.js services.
- Exposed `/metrics` from:
  - `auth-service`
  - `product-service`
  - `cart-service`
  - `order-service`
  - `notification-service`
- Added Helm-managed `ServiceMonitor` resources.
- Fixed Kubernetes Service labels so ServiceMonitor can discover the CloudMart Services.
- Verified Prometheus targets show all CloudMart services as `UP`.
- Created and imported a CloudMart-specific Grafana dashboard.

## Completed: CloudMart Infrastructure Dashboard

The Grafana dashboard monitors the `cloudmart` namespace.

Dashboard panels include:

- CloudMart services up
- HTTP requests per second
- 5xx error rate
- p95 HTTP latency
- Pod CPU usage
- Pod memory usage
- Pod restarts
- Node.js heap usage
- Node.js event loop lag

Dashboard JSON:

```text
docs/monitoring/grafana-dashboards/cloudmart-observability-dashboard.json
```

## Completed: Application Metrics

Each backend service exposes Prometheus metrics at:

```text
/metrics
```

Important metrics:

```text
cloudmart_http_requests_total
cloudmart_http_request_duration_seconds
cloudmart_nodejs_heap_size_used_bytes
cloudmart_nodejs_eventloop_lag_seconds
```

Useful PromQL:

```promql
up{namespace="cloudmart"}
```

```promql
sum by (service) (
  rate(cloudmart_http_requests_total{namespace="cloudmart"}[5m])
)
```

```promql
histogram_quantile(
  0.95,
  sum by (le, service) (
    rate(cloudmart_http_request_duration_seconds_bucket{namespace="cloudmart"}[5m])
  )
)
```

## Added: Alert Rules

CloudMart now includes Helm-managed Prometheus alert rules.

File:

```text
infra/helm/cloudmart/templates/monitoring/cloudmart-prometheus-rules.yaml
```

Alerts added:

```text
CloudMartServiceDown
CloudMartHigh5xxErrorRate
CloudMartHighLatencyP95
CloudMartPodRestarting
CloudMartPodNotReady
CloudMartHighMemoryUsage
```

These alerts are collected by Prometheus and displayed in Alertmanager.

Important note:

```text
Alert rules decide when an alert should fire.
Alertmanager receivers decide where the alert should be sent.
```

The alert rules are now part of the CloudMart Helm chart. A receiver such as email, Slack, or SNS can be added next.

## Verify Alert Rules

After Argo CD syncs the CloudMart app, verify:

```bash
kubectl get prometheusrule -n cloudmart
```

Expected:

```text
cloudmart-alert-rules
```

Describe the rules:

```bash
kubectl describe prometheusrule cloudmart-alert-rules -n cloudmart
```

Open Prometheus:

```bash
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
```

Then check:

```text
http://localhost:9090/alerts
```

Open Alertmanager:

```bash
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-alertmanager 9093:9093
```

Then check:

```text
http://localhost:9093
```

## Completed: Alertmanager Receiver With SNS Email

CloudMart now has an Alertmanager receiver configured through `AlertmanagerConfig`.

Receiver file:

```text
infra/helm/cloudmart/templates/monitoring/cloudmart-alertmanager-config.yaml
```

Terraform creates:

```text
SNS topic: cloudmart-monitoring-alerts
Email subscription: fathimayosra25@gmail.com
IAM policy: cloudmart-monitoring-alerts-publish-policy
```

Alertmanager publishes alerts to SNS. SNS then sends the alerts to email.

Important:

```text
The SNS email subscription must be confirmed from the email inbox before alert emails are delivered.
```

Verify the subscription:

```bash
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:us-east-1:506098131053:cloudmart-monitoring-alerts \
  --region us-east-1
```

If it shows `PendingConfirmation`, open the AWS SNS confirmation email and click Confirm.

Verify the receiver object:

```bash
kubectl get alertmanagerconfig -n cloudmart
kubectl get serviceaccount monitoring-kube-prometheus-alertmanager -n monitoring -o yaml
```

The service account should have an annotation like:

```text
eks.amazonaws.com/role-arn: arn:aws:iam::506098131053:role/...
```

This is IRSA. It allows Alertmanager to publish to SNS without storing AWS access keys in Kubernetes.

## Remaining: CloudWatch Logs

CloudWatch will be used for logs, while Prometheus is used for metrics.

Difference:

```text
Prometheus:
  Metrics, dashboards, alert conditions.

CloudWatch:
  Logs, AWS service visibility, EKS/application log storage.
```

Recommended CloudWatch phase:

1. Create an IAM policy for CloudWatch log writes.
2. Create an IRSA service account for a log agent.
3. Install `aws-for-fluent-bit` on EKS.
4. Send CloudMart pod logs to CloudWatch Logs.
5. Verify log groups and log streams in AWS Console.
6. Add documentation and screenshots.

## Final Observability Architecture

```text
CloudMart Application
        |
        | /metrics
        v
Prometheus <--- ServiceMonitor
        |
        +--> Grafana dashboards
        |
        +--> Alertmanager alerts

CloudMart Pod Logs
        |
        v
CloudWatch Logs
```
