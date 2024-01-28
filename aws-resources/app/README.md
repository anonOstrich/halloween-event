# CDK project for provisioning AWS resources

Since the free tier of postgres databases provided by Vercel is limited to one database, the databases are in AWS.

For now there is no protection for the existing data when updating infrastructure, so that will have to be manually safeguarded, if wanted. 

## Deploying infrastructure changes

Install the dependencies of this folder (and the parent folder if you don't have aws cdk available). Run `npx cdk list` to see the options for stacks (demo or prod). Run `npx cdk deploy` to deploy changes.

For now, you'll need to update the environment variables for different environments in Vercel and redeploy the apps there after updating AWS resources. The relevant changing resources are the database hostnames and passwords, which can be found in RDS and Secrets Manager, respectively. To fetch them from the command line: 




## (LEFTOVER FROM DEFAULT README) Useful commands 

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
