import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

export class DemoDBStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // If exists, could also be imported somehow
    const vpc = new ec2.Vpc(this, 'VPC1', {
      vpcName: "PostgresVPC1",
    });

    const securityGroup = new ec2.SecurityGroup(this, "AppOpenSecurityGroup1", {
      vpc: vpc,
      allowAllOutbound: true,
      description: "Allow inbound postgres traffic and all outbound traffic",
    })
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), "Allow postgres traffic from anywhere")



    const secret = new rds.DatabaseSecret(this, 'AppDatabaseSecret1', {
      username: 'postgres',
      secretName: 'AppDatabaseSecret1',
      dbname: 'appdb'
    })


    const db = new rds.DatabaseInstance(this, 'AppDatabase1', {
      engine: rds.DatabaseInstanceEngine.postgres({version: rds.PostgresEngineVersion.VER_15}),

      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      vpc: vpc,
      credentials: {
        username: 'postgres'
      },

      allocatedStorage: 20,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      databaseName: 'appdb',
      // Networking part!
      publiclyAccessible: true,
      securityGroups: [securityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      }
    }
    )

    


    this.exportValue(db.instanceEndpoint.hostname, { name: 'AppDatabaseHostname1' });

    this.exportValue(secret.secretFullArn, { name: 'DatabaseSecret1' });
  }

}
