# AWS File Processing System

## Description

This project is a demonstration of my ability to design and implement a cloud-based file processing system using AWS services. The system includes a responsive web UI built with ReactJS for uploading files to S3. The backend infrastructure is managed using AWS CDK in TypeScript and includes Lambda functions for processing, DynamoDB for storage, and EC2 instances for further processing.

## Architecture Overview

### ReactJS Web UI

- A responsive interface for uploading files and input text.
- Directly uploads files to S3 without sending file content directly to Lambda.

### AWS Services

- **S3**: Stores the uploaded files.
- **DynamoDB**: Stores metadata about the files, including paths and input text.
- **Lambda**: Processes the file uploads and triggers EC2 instances.
- **EC2**: Runs scripts to process the files further.

### Trigger Mechanism

- When a file is uploaded to S3, a Lambda function saves the file path and input text in DynamoDB.
- A DynamoDB stream triggers another Lambda function that creates an EC2 instance.
- The EC2 instance processes the file and updates DynamoDB with the results.

## Basic Requirements

- **AWS CDK**: Used to manage all AWS infrastructure (latest version, TypeScript).
- **AWS SDK V3**: Used in Lambda functions (latest version, not V2).
- **Security Best Practices**: No hard-coded AWS credentials; uses environment variables and IAM roles.
- **Error Handling**: Implemented in Lambda functions and EC2 scripts.
- **Professional Code**: Reader-friendly and professional naming conventions and folder structures.
- **README**: Detailed and reader-friendly.

## Bonus Features

- **AWS Cognito**: Used as an API Gateway Authorizer.
- **AWS Amplify**: Frontend code hosted using Amplify for CI/CD.
- **TailwindCSS and Flowbite**: Used for responsive UI.

## Project Structure

```
my-aws-project/
├── bin/
│   └── my-aws-project.ts
├── lib/
│   └── my-aws-project-stack.ts
├── lambda/
│   ├── ec2/
│   │   └── index.js
│   └── process/
│       └── index.js
├── s3-upload-ui/
│   ├── public/
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   ├── package-lock.json
│   └── ...
├── cdk.json
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

### Prerequisites

- Node.js
- AWS CLI configured
- AWS CDK installed

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-repo/my-aws-project.git
   cd my-aws-project
   ```

2. **Set Up React Application:**

   ```bash
   cd s3-upload-ui
   npm install
   npm start
   ```

3. **Initialize and Deploy CDK Stack:**

   ```bash
   cd ../
   cdk bootstrap aws://123456789012/us-east-1
   cdk deploy
   ```

### AWS CDK Deployment

Ensure the environment variables `CDK_DEFAULT_ACCOUNT` and `CDK_DEFAULT_REGION` are set correctly or use the `--profile` option for specifying AWS credentials.

```bash
cdk bootstrap aws://123456789012/us-east-1
cdk deploy
```

## Usage

1. **Upload Files**: Use the ReactJS web UI to upload files and input text.
2. **Processing**: Uploaded files are stored in S3, and metadata is saved in DynamoDB.
3. **Trigger**: Lambda functions handle the processing, and EC2 instances are used for additional processing.

## Security and Best Practices

- **IAM Roles**: Proper roles and policies are assigned to Lambda functions and EC2 instances.
- **No Hard-Coded Credentials**: Credentials are managed via IAM roles and environment variables.
- **Error Handling**: Implemented in Lambda functions and EC2 scripts.

## Conclusion

This project demonstrates my ability to design, implement, and deploy a comprehensive cloud-based file processing system using AWS services, adhering to best practices and security guidelines. The project is ready for real-world application and further development.
