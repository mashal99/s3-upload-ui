import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class MyAwsProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda Function to process S3 uploads and save to DynamoDB
    const processLambda = new lambda.Function(this, 'ProcessLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/process'),
      environment: {
        TABLE_NAME: table.tableName,
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // Grant permissions
    bucket.grantReadWrite(processLambda);
    table.grantFullAccess(processLambda);

    // API Gateway with Cognito Authorizer
    const userPool = new cognito.UserPool(this, 'UserPool');
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
    });
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'APIAuthorizer', {
      cognitoUserPools: [userPool],
    });

    const api = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'My Service',
      description: 'This service handles file uploads.',
    });

    const uploadResource = api.root.addResource('upload');
    const uploadIntegration = new apigateway.LambdaIntegration(processLambda);

    uploadResource.addMethod('POST', uploadIntegration, {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // Lambda to create and terminate EC2 instance
    const ec2Lambda = new lambda.Function(this, 'Ec2Lambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/ec2'),
      environment: {
        TABLE_NAME: table.tableName,
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // Grant necessary permissions
    ec2Lambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ec2:RunInstances', 'ec2:TerminateInstances', 'ec2:DescribeInstances', 'ec2:DescribeInstanceStatus', 'ec2:StartInstances', 'ec2:StopInstances'],
      resources: ['*'],
    }));

    // EventBridge rule to trigger Lambda on DynamoDB insert
    const rule = new events.Rule(this, 'Rule', {
      eventPattern: {
        source: ['aws.dynamodb'],
        detailType: ['DynamoDB Stream Record'],
        detail: {
          eventName: ['INSERT'],
        },
      },
    });

    rule.addTarget(new targets.LambdaFunction(ec2Lambda));

    // Output the bucket name
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
    });
  }
}
