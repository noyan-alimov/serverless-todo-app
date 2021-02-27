// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'qoqwc0z3k3'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'football-booking.eu.auth0.com', // Auth0 domain
  clientId: 'P19c7yavm7Tm37gOWueJL61PdowxgZMW', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
