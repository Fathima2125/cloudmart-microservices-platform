# ec2 SET UP

#### CloudMart Docker images were built locally, tagged with AWS ECR repository URLs, and pushed to Amazon ECR. ECR will be used by Amazon EKS to pull container images during deployment.

## Step 1: Check AWS CLI login

Run:
```
aws sts get-caller-identity
```

## Step 2: Choose AWS region

Use one region consistently. Example:

``` 
export AWS_REGION=us-east-1
 ```

## Step 3: Create ECR repositories

Create one repo per service:
```
aws ecr create-repository --repository-name cloudmart-auth-service --region $AWS_REGION
aws ecr create-repository --repository-name cloudmart-product-service --region $AWS_REGION
aws ecr create-repository --repository-name cloudmart-cart-service --region $AWS_REGION
aws ecr create-repository --repository-name cloudmart-order-service --region $AWS_REGION
aws ecr create-repository --repository-name cloudmart-notification-service --region $AWS_REGION
aws ecr create-repository --repository-name cloudmart-frontend --region $AWS_REGION
```


## Step 4: Get AWS account ID
```
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

```

Check:
```
echo $AWS_ACCOUNT_ID
```

## Step 5: Login Docker to ECR
```
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

## Step 6: Build and push images

Example for auth service:
```
docker build -t cloudmart-auth-service ./services/auth-service
docker tag cloudmart-auth-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-auth-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-auth-service:latest
```

Do the same for each service:
```
docker build -t cloudmart-product-service ./services/product-service
docker tag cloudmart-product-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-product-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-product-service:latest ```

```
docker build -t cloudmart-cart-service ./services/cart-service
docker tag cloudmart-cart-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-cart-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-cart-service:latest
```

````
docker build -t cloudmart-cart-service ./services/cart-service
docker tag cloudmart-cart-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-cart-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-cart-service:latest
```
```
docker build -t cloudmart-order-service ./services/order-service
docker tag cloudmart-order-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-order-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-order-service:latest
```

```
docker build -t cloudmart-notification-service ./services/notification-service
docker tag cloudmart-notification-service:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-notification-service:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-notification-service:latest ```


````
docker build -t cloudmart-frontend ./frontend
docker tag cloudmart-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cloudmart-frontend:latest

``` 


## Step 7: Verify in AWS

Run:
```
aws ecr describe-repositories --region $AWS_REGION
```

You should see all CloudMart repositories.

Then: 
````
aws ecr list-images --repository-name cloudmart-auth-service --region $AWS_REGION
aws ecr list-images --repository-name cloudmart-product-service --region $AWS_REGION
aws ecr list-images --repository-name cloudmart-cart-service --region $AWS_REGION
aws ecr list-images --repository-name cloudmart-notification-service --region $AWS_REGION
aws ecr list-images --repository-name cloudmart-order-service --region $AWS_REGION
aws ecr list-images --repository-name cloudmart-frontend --region $AWS_REGION
````