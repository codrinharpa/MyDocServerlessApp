'use strict';
global.fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('../config.json');
const poolData = {
  UserPoolId : config.pacientPoolConfig.UserPoolId,
  ClientId : config.pacientPoolConfig.ClientId
};
module.exports.handler = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);

    var authenticationData = {
      Username : requestBody.username,
      Password : requestBody.password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username : requestBody.username,
      Pool : userPool
    });
    console.log("inainte de apel");
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
          console.log(result);
          console.log('access token + ' + result.getAccessToken().getJwtToken());
          /*Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
          console.log('idToken + ' + result.idToken.jwtToken);
          callback(null,{
            statusCode: 200,
            body: JSON.stringify({
              response: result
            }),
          });
      },

      onFailure: function(err) {
        console.log("e de la ei,ba!");
        callback(null,{
          statusCode: 400,
          body: JSON.stringify({
            message: err
          }),
        });

      },

    });
};