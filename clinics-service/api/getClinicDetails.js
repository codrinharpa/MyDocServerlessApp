'use strict';
global.fetch = require('node-fetch');
const Joi = require('joi');
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const config = require('../config.json');

const docClient = new AWS.DynamoDB.DocumentClient();
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId : config.clinicsDoctorsPool.UserPoolId,
    ClientId : config.clinicsDoctorsPool.ClientId
});
module.exports.handler = (event, context, callback) => {
    var pathParameters = event.pathParameters;
    console.log(pathParameters);
    if(pathParameters == undefined){
        callback(null,{
            statusCode: 400,
            body: JSON.stringify({
                message:"Specify path parameter"
            }),
        });
        return;
    }
    var params = {
        TableName : 'Clinics',
        Key: {
          email: pathParameters.email
        }
      };
      
    docClient.get(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(null,{
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                message: "Ups"
                }),
            });
        } 
        else {
            console.log(data);
            callback(null,{
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    user: data.Item
                }),
            });
            return;
        }

    });
};

