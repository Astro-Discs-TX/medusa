Got it! I’ll create a separate document that explains how to build the frontend image using the provided commands and how to push it to an AWS ECR repository. Here’s the draft:

---

# **Building and Deploying the MedusaJS Frontend**

This guide explains how to build the MedusaJS frontend using the provided starter template and deploy the resulting Docker image to an AWS ECR repository. This process is essential for deploying the frontend as part of the MedusaJS e-commerce solution.

- [Prerequisites](#prerequisites)
- [Setting Up the Frontend Repository](#setting-up-the-frontend-repository)
- [Building the Frontend Docker Image](#building-the-frontend-docker-image)
- [Pushing the Image to AWS ECR](#pushing-the-image-to-aws-ecr)
- [Next Steps](#next-steps)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)

---

## **Prerequisites**

Before proceeding, ensure you have the following:
- **Docker**: Installed and running on your machine. Download Docker [here](https://docs.docker.com/get-started/get-docker/).
- **AWS CLI**: Installed and configured with your AWS credentials. Follow the [AWS CLI Quickstart guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html) if you haven’t set it up yet.
- **Git**: Installed on your machine. Download Git [here](https://git-scm.com/).

---

## **Setting Up the Frontend Repository**

1. Clone the `medusa-starter` repository to your local machine:
   ```bash
   git clone https://github.com/u11d-com/medusa-starter.git
   cd medusa-starter
   ```

2. Navigate to the `storefront` directory and initialize the frontend repository:
   ```bash
   cd storefront
   git init
   git remote add origin https://github.com/medusajs/nextjs-starter-medusa.git
   git fetch --depth 1 origin 0f5452dfe44838f890b798789d75db1a81303b7a
   git checkout 0f5452dfe44838f890b798789d75db1a81303b7a
   ```

---

## **Building the Frontend Docker Image**

1. Build the Docker image for the frontend:
   ```bash
   docker build -t medusa_storefront:1.0.0 .
   ```
   - Replace `medusa:storefront` with a tag in the format `<image_tag>:<version>`. For example, `my-frontend:1.0.0`.

---

## **Pushing the Image to AWS ECR**

To deploy the frontend, you’ll need to push the Docker image to an AWS ECR repository. Follow these steps:

### **Step 1: Authenticate Docker to Your ECR Repository**
Run the following command to authenticate Docker to your ECR repository:
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
```
Replace:
- `<region>` with your AWS region (e.g., `us-east-1`).
- `<aws_account_id>` with your AWS account ID.

### **Step 2: Tag the Docker Image**
Tag the Docker image with your ECR repository URI:
```bash
docker tag medusa:storefront <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repository>:<tag>
```
Replace:
- `<aws_account_id>` with your AWS account ID.
- `<region>` with your AWS region.
- `<repository>` with the name of your ECR repository.
- `<tag>` with the desired image tag (e.g., `1.0.0`).

### **Step 3: Push the Docker Image**
Push the Docker image to your ECR repository:
```bash
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repository>:<tag>
```

Example:
```bash
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-frontend:1.0.0
```

For more details, refer to the [AWS ECR documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html).

---

## **Next Steps**

- Use the pushed image in your Terraform configuration by providing the ECR repository URI and tag in module configuration:
  ```hcl
  storefront_container_image = "<aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repository>:<tag>"
  ```
- Deploy the frontend by enabling the `storefront_create` option in your Terraform configuration.

---

## **Troubleshooting**

### **Common Issues**
- **Docker Build Fails**: Ensure all dependencies are installed and the Dockerfile is correctly configured.
- **ECR Authentication Fails**: Verify that your AWS credentials are correctly configured and have the necessary permissions.
- **Image Push Fails**: Ensure the ECR repository exists and the image tag matches the repository URI.

---

:heart: _Technology made with passion by u11d_