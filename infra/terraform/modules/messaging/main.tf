resource "aws_sns_topic" "order_events" {
  name = "${var.project_name}-order-events"

  tags = {
    Name = "${var.project_name}-order-events"
  }
}

resource "aws_sqs_queue" "notification_events" {
  name                       = "${var.project_name}-notification-events"
  visibility_timeout_seconds = 60
  message_retention_seconds  = 345600

  tags = {
    Name = "${var.project_name}-notification-events"
  }
}

data "aws_iam_policy_document" "notification_events_queue" {
  statement {
    sid    = "AllowSnsToSendMessages"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }

    actions = [
      "sqs:SendMessage"
    ]

    resources = [
      aws_sqs_queue.notification_events.arn
    ]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_sns_topic.order_events.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "notification_events" {
  queue_url = aws_sqs_queue.notification_events.id
  policy    = data.aws_iam_policy_document.notification_events_queue.json
}

resource "aws_sns_topic_subscription" "notification_events" {
  topic_arn            = aws_sns_topic.order_events.arn
  protocol             = "sqs"
  endpoint             = aws_sqs_queue.notification_events.arn
  raw_message_delivery = true

  depends_on = [
    aws_sqs_queue_policy.notification_events
  ]
}
