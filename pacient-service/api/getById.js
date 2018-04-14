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
                cognitoUser.getUserAttributes(function(err, result) {
                    if (err) {
                        alert(err);
                        return;
                    }
                    console.log(result);
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