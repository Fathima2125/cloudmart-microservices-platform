# CloudMart SNS + SQS Event-Driven Notifications

This phase changes CloudMart notifications from direct service-to-service calls into an AWS event-driven flow.

## Previous Flow

```text
order-service
  -> HTTP call
  -> notification-service
  -> PostgreSQL notifications table
```

This works, but if `notification-service` is down, the direct HTTP call can fail.

## New Flow

```text
order-service
  -> publish event to SNS topic
  -> SNS delivers message to SQS queue
  -> notification-service polls SQS
  -> notification-service writes to PostgreSQL
```

## AWS Resources

Terraform creates:

```text
SNS topic: cloudmart-order-events
SQS queue: cloudmart-notification-events
SNS subscription: topic -> queue
SQS queue policy allowing SNS to send messages
EKS node IAM permissions for SNS publish and SQS consume
```

Terraform module:

```text
infra/terraform/modules/messaging
```

## Application Changes

`order-service` publishes notification events to SNS when:

```text
order is placed
order status becomes SHIPPED
order status becomes DELIVERED
```

`notification-service` continuously polls SQS. When a message arrives, it creates a notification row in PostgreSQL and deletes the SQS message.

## Helm Configuration

The Helm chart passes AWS messaging configuration through ConfigMaps:

```yaml
messaging:
  awsRegion: us-east-1
  orderEventsTopicArn: arn:aws:sns:us-east-1:506098131053:cloudmart-order-events
  notificationEventsQueueUrl: https://sqs.us-east-1.amazonaws.com/506098131053/cloudmart-notification-events
```

## Why This Is Better

```text
Loose coupling: order-service does not depend directly on notification-service
Durability: SQS stores messages until notification-service processes them
Retry behavior: failed messages can be retried
Cloud-native design: AWS messaging services handle event delivery
```

## Apply Steps

Create AWS messaging resources:

```bash
terraform -chdir=infra/terraform/environments/dev apply
```

Commit and push the service/Helm changes:

```bash
git add .
git commit -m "Add SNS and SQS event-driven notifications"
git push origin develop
```

GitHub Actions will build and push new images, update `values.yaml`, and Argo CD will deploy the new version.

## Verify

Check AWS resources:

```bash
aws sns list-topics --region us-east-1
aws sqs list-queues --region us-east-1
```

Check notification-service logs:

```bash
kubectl logs deployment/notification-service -n cloudmart
```

Expected log:

```text
SQS notification consumer started
Notification Sent: Your order #... has been placed successfully
```

Test through the website:

```text
register/login
add product to cart
checkout/place order
open notifications page
```

The notification should appear after the order event is processed from SQS.

## Screenshots To Capture

```text
SNS topic cloudmart-order-events
SQS queue cloudmart-notification-events
SNS subscription to SQS
GitHub Actions successful run
Argo CD synced after image tag update
notification-service logs showing SQS consumer
CloudMart notification visible in website
```
