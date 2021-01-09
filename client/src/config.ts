// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3w0gzeilag'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-1.amazonaws.com/dev` 

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'aws-ahmedy-dev.us.auth0.com',            // Auth0 domain
  clientId: 'Mj6squP70myU2UhXmUo56bdLWhvLBrae',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
