
# 📨 User Events Processor - AWS Lambda Consumer

A **serverless microservice** built with **TypeScript** to consume messages from **AWS SQS queues** (triggered by SNS notifications) and persist structured data into **DynamoDB**.
This project uses **Docker images** for Lambda packaging and is fully deployed using **AWS CDK**.

---

## 💡 Architecture

```
User Service API → SNS Topic → SQS Queue → Lambda → DynamoDB
```

* **User Service API**: publishes user events to SNS (`USER_CREATED`, etc.)
* **SNS Topic**: fan-out mechanism for events
* **SQS Queue**: reliable buffer for Lambda
* **Lambda Consumer**: processes events and saves user data in DynamoDB
* **DynamoDB**: fast, scalable, NoSQL storage for user data

![Architecture Diagram](https://raw.githubusercontent.com/your-repo-path/architecture.png)
*(replace with your diagram if you have)*

---

## ⚙️ Technologies

| Technology              | Purpose                           |
| ----------------------- | --------------------------------- |
| AWS Lambda              | Event processing                  |
| AWS SNS                 | Pub/Sub for user events           |
| AWS SQS                 | Decoupled, reliable message queue |
| AWS DynamoDB            | NoSQL data persistence            |
| AWS CDK                 | Infrastructure as Code            |
| Docker + ECR            | Lambda packaging and deployment   |
| Node.js 18 + TypeScript | Lambda runtime                    |

---

## 📥 Input Payload Example

Example SNS → SQS payload consumed by the Lambda:

```json
{
  "Type": "Notification",
  "Message": "{\"eventType\":\"USER_CREATED\",\"data\":\"{\\\"identification\\\":\\\"uuid\\\",\\\"nome\\\":\\\"John Doe\\\",\\\"email\\\":\\\"john@example.com\\\"}\"}"
}
```

---

## 📝 Lambda Behavior

1. Reads SQS event batch
2. Parses SNS notification + event data
3. Validates and transforms `UserData`
4. Inserts into DynamoDB table (`user-events`)

```typescript
await docClient.send(new PutCommand({
  TableName: process.env.TABLE_NAME!,
  Item: userData
}));
```

---

## 🚀 Deployment

```bash
# Build Docker image
docker build -t user-lambda-consumer .

# Tag & Push to ECR
docker tag user-lambda-consumer:latest <account-id>.dkr.ecr.<region>.amazonaws.com/user-lambda-consumer:latest
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/user-lambda-consumer:latest

# Deploy CDK
cdk deploy
```

---

## ✅ Improvements for Production

* Add schema validation for payloads (`ajv`, `zod`, etc.)
* Add DLQ (Dead Letter Queue) for failed messages
* Add alarms & monitoring (CloudWatch, Datadog, etc.)
* Add unit tests for Lambda logic

---

## 📝 Author

Dowglas Maia
[LinkedIn](https://linkedin.com/in/dowglasmaia) • [GitHub](https://github.com/dowglasmaia)

