# **Terraform Module for MedusaJS on AWS**

This guide explains how to use the **Terraform module for MedusaJS** to deploy a production-ready e-commerce backend on AWS. The module is designed for front-end developers with little to no experience in AWS or Terraform, making it easy to set up and manage infrastructure.

## Table of Contents

- [Introduction](#Introduction)
  - [What is Terraform?](#what-is-terraform)
  - [Why Use This Terraform Module?](#why-use-this-terraform-module)
- [Prerequisites](#prerequisites)
  - [Tools Required](#tools-required)
  - [AWS Account Setup](#aws-account-setup)
- [Overview of the Terraform Module](#overview-of-the-terraform-module)
- [Step-by-Step Guide to Using the Terraform Module](#step-by-step-guide-to-using-the-terraform-module)
- [Connecting MedusaJS to the Deployed Infrastructure](#connecting-medusajs-to-the-deployed-infrastructure)
- [Optional Features](#optional-features)
  - [Enable ECR for Container Images](#enable-ecr-for-container-images)
  - [Use an External Image Repository](#use-an-external-image-repository)
- [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
  - [Common Errors](#common-errors)
  - [Clean Up Resources](#clean-up-resources)
- [Next Steps](#next-steps)
  - [Deploy the Frontend](#deploy-the-frontend)
- [FAQs](#faqs)
  - [Can I use this for local development?](#can-i-use-this-for-local-development)
  - [How do I update the infrastructure?](#how-do-i-update-the-infrastructure)

---

## **Introduction**

### **What is Terraform?**
Terraform is an infrastructure-as-code tool that allows you to define and provision cloud resources using code. It simplifies the process of managing cloud infrastructure and ensures consistency across environments. Learn more about Terraform [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/infrastructure-as-code).

### **Why Use This Terraform Module?**
This Terraform module simplifies the deployment of MedusaJS on AWS by automating the setup of essential infrastructure components, such as databases, caching, and backend services. It’s designed for front-end developers who want to focus on building their e-commerce store without worrying about cloud infrastructure.

---

## **Prerequisites**

Before using this Terraform module, ensure you have the following tools and accounts set up:

### **Tools Required**
- **Terraform CLI**: Install Terraform by following the [official installation guide](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli).
- **AWS CLI**: Install the AWS CLI by following the [official installation guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
- **Node.js**: Install Node.js from the [official website](https://nodejs.org/).

### **AWS Account Setup**
- **Create an AWS Account**: If you don’t already have an AWS account, follow the [AWS Getting Started Guide](https://docs.aws.amazon.com/accounts/latest/reference/getting-started.html) to create one.
- **Configure AWS Credentials**: Set up your AWS credentials for Terraform by following the [AWS CLI Quickstart guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html).

---

## **Overview of the Terraform Module**

This Terraform module sets up the following AWS resources for MedusaJS:

### **Core Infrastructure**
- **RDS (PostgreSQL)**: A managed relational database for storing MedusaJS data.
- **Redis**: A caching layer to improve performance.
- **ECS (Backend Tasks)**: Runs the MedusaJS backend as containerized tasks.
- **ALB (Application Load Balancer)**: Distributes incoming traffic to the backend tasks.

### **Optional Features**
- **ECR (Elastic Container Registry)**: Stores Docker images for the backend and frontend (if enabled).
- **Frontend ECS Tasks**: Runs the frontend application (if enabled).
- **CloudFront**: A CDN to serve the frontend with low latency (if enabled).

---

## **Step-by-Step Guide to Using the Terraform Module**

### **Step 1: Download or Clone the Module**
Clone the Terraform module repository to your local machine:
```bash
git clone https://github.com/u11d-com/terraform-aws-medusajs
cd terraform-u11d-medusajs/exaples/minimal
```

### **Step 2: Provide Variables for the Module**
See module inputs documentation for available configuration options.
[Example configurations](https://github.com/u11d-com/terraform-aws-medusajs/tree/main?tab=readme-ov-file#examples) as a reference.

Example variables:
```hcl
aws_region = "us-east-1"
backend_container_image = "your-medusa-backend-image:latest"
```

### **Step 3: Initialize Terraform**
Run the following command to initialize Terraform and download the required providers:
```bash
terraform init
```

### **Step 4: Plan the Infrastructure**
Preview the resources that Terraform will create:
```bash
terraform plan
```

### **Step 5: Apply the Infrastructure**
Deploy the infrastructure by running:
```bash
terraform apply
```
Confirm the deployment by typing `yes` when prompted.

### **Step 6: Verify the Setup**
1. Check the Terraform outputs for the MedusaJS backend URL.
2. Use the URL to verify that the backend is running.

---

## **Connecting MedusaJS to the Deployed Infrastructure**

Once the infrastructure is deployed, the MedusaJS backend URL will be available in the Terraform outputs. Use this URL to connect your MedusaJS application to the deployed backend.

---

## **Optional Features**

### **Enable ECR for Container Images**
To create an ECR repository for storing container images, provide the following variable:
```hcl
ecr_backend_create = true
ecr_storefront_create = true
```

### **Use an External Image Repository**
If you’re using an external image repository, provide the repository address and image tag as variables, optionally you might need to provide credentials for repository:
```hcl
backend_container_image = "your-repo/medusa-backend:latest"
backend_container_registry_credentials = {
    username = "your-registry-username"
    password = "your-registry-password"
  }
storefront_container_image = "your-repo/medusa-backend:latest"
storefront_container_registry_credentials = { = {
    username = "your-registry-username"
    password = "your-registry-password"
  }
```
---

## **Common Issues and Troubleshooting**

### **Common Errors**
- **AWS Permission Errors**: Ensure your AWS credentials are correctly configured.
- **Terraform State Issues**: Avoid manually modifying resources created by Terraform.

### **Clean Up Resources**
To delete all resources created by Terraform, run:
```bash
terraform destroy
```

---

## **Next Steps**
- Learn how to set up MedusaJS locally using the [medusa-starter repository](https://github.com/u11d-com/medusa-starter).
- Explore the MedusaJS starter templates:
  - [Backend Starter Template](https://github.com/medusajs/medusa-starter-default).
  - [Frontend Starter Template](https://github.com/medusajs/nextjs-starter-medusa).

### **Deploy the Frontend**
MedusaJS starter kits typically use the Next.js framework to build the storefront web application. Next.js requires that the MedusaJS backend is available and responsive during the build process to properly fetch data and create a fully functional storefront. This is important because storefront will be built using the API provided by the backend application.

To deploy the frontend, provide the following variables:
```hcl
storefront_create = true
storefront_container_image  = "your-repo/frontend:latest"
```

---

## **FAQs**

### **Can I use this for local development?**
No, you can use the [medusa-starter repository](https://github.com/u11d-com/medusa-starter) to set up MedusaJS locally.

### **How do I update the infrastructure?**
Modify the Terraform configuration files and run `terraform apply` to apply the changes.

---

:heart: _Technology made with passion by u11d_