'use strict';
global.fetch = require('node-fetch');
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
    var authorizer = event.requestContext.authorizer;
    var groups = authorizer.claims['cognito:groups'];
    var clinicEmail = authorizer.claims.email;
    console.log(groups);
    if(authorizer == undefined){
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                message:"You must provide an Authorization token"
            }),
          });
        return
    }
    if(!groups.includes('Clinics')){
        callback(null,{
            statusCode: 400,
            body: JSON.stringify({
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                message:"You are not logged in as a Clinic"
            }),
        });
        return;
    }
    var params = {
        TableName: "Clinics",
        Key: {
            email: clinicEmail
        },
        AttributesToGet: ['doctorsEmails']
    }
    docClient.get(params).promise().then(function(data){
        var keys = [];
        for (let i = 0; i < data.Item.doctorsEmails.length;i++){
            keys.push({
                "email": data.Item.doctorsEmails[i]
            });
        }
        console.log(keys);
        var params = {
            RequestItems: {
                'Doctors': {
                    Keys: keys
                }
            }
        };
        docClient.batchGet(params,function(err,data){
            if(err){
                console.log(err);
                callback(null,{
                    statusCode: 500,
                    body: JSON.stringify({
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        },
                        message: err
                    }),
                });
                return;
            }
            console.log(data);
            callback(null,{
                statusCode: 200,
                body: JSON.stringify({
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    doctors: data.Responses.Doctors
                }),
            });
        });
    }).catch(function(err){
        console.log(err);
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                message: err
            }),
        });
        return;
    });
};

