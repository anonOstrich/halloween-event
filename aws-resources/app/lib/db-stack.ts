import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds'
import * as ec2 from 'aws-cdk-lib/aws-ec2'


const ALLOWED_VALUES = ['prod', 'test'] as const
type Stage = typeof ALLOWED_VALUES[number]


export class DBStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps & {stage: Stage}) {
    super(scope, id, props);

    const { stage } = props

    function stagedName(name: string) {
      return `${name}-${stage}`
    }

    // The code that defines your stack goes here

    // If exists, could also be imported somehow
    const vpc = new ec2.Vpc(this, 'VPC', {
      vpcName: stagedName("PostgresVPC"),
    });

    const securityGroup = new ec2.SecurityGroup(this, "AppOpenSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
      description: "Allow inbound postgres traffic and all outbound traffic",
    })
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), "Allow postgres traffic from anywhere")



    const secret = new rds.DatabaseSecret(this, 'AppDatabaseSecret', {
      username: 'postgres',
      secretName: stagedName('AppDatabaseSecret'),
      dbname: 'appdb'
    })


    const db = new rds.DatabaseInstance(this, 'AppDatabase', {
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

    // NOTE: proxy cannot be publicly accessible!
    // If performance is an issue, configure a more elaborate setup making use of the proxy

/*    const dbProxy = new rds.DatabaseProxy(this, 'AppDatabaseProxy', {
      proxyTarget: rds.ProxyTarget.fromInstance(db),
      vpc: vpc,
      secrets: [db.secret!],
      securityGroups: [securityGroup],
      dbProxyName: 'AppDatabaseProxy',
      maxConnectionsPercent: 100,
      requireTLS: false,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PUBLIC
      })
      
    })
    */
    


    this.exportValue(db.instanceEndpoint.hostname, { name: stagedName('AppDatabaseHostname') });


    // this.exportValue(dbProxy.endpoint, { name: 'AppDatabaseProxyHostname' });
  }

}
