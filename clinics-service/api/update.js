'use strict';
global.fetch = require('node-fetch');
const Joi = require('joi');
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('../config.json');
var attributeList = [];

const docClient = new AWS.DynamoDB.DocumentClient();
const userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId : config.clinicsDoctorsPool.UserPoolId,
    ClientId : config.clinicsDoctorsPool.ClientId
});
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();


const updateSchema = Joi.object().keys({
  phone: Joi.string().regex(/^[0-9]{10}$/).required(),
  name: Joi.string().required(),
  practiceType: Joi.string().required(),
  description: Joi.string().required(),
  city: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude:Joi.string().required()
});
module.exports.handler = (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    var authorizer = event.requestContext.authorizer;
    var groups = authorizer.claims['cognito:groups'];
    var userEmail = authorizer.claims.email;

    if(authorizer == undefined){
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"You must provide an Authorization token"
            }),
          });
        return
    }
    var tableName = null;
    if(groups.includes('Clinics')){
        tableName = 'Clinics';
    }
    else if(groups.includes('Doctors')){
        tableName = 'Doctors';
    }

  var userAttributes = {
    phone: requestBody.phone,
    name: requestBody.name,
    description: requestBody.description,
    practiceType: requestBody.practiceType,
    city:requestBody.city,
    latitude: requestBody.latitude,
    longitude: requestBody.longitude
  }
  Joi.validate(userAttributes,updateSchema,function(err,value){
    if(err){
      callback(null,{
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        statusCode: 400,
        body: JSON.stringify({
          message: err
        }),
      });
      return;
    }
    var dynamoPutParams = {
        TableName:tableName,
        Item:{
            email : userEmail,
            phone: userAttributes.phone,
            name: userAttributes.name,
            practiceType: userAttributes.practiceType,
            description: userAttributes.description,
            city: userAttributes.city,
            latitude: userAttributes.latitude,
            longitude: userAttributes.longitude
            }
    };
    docClient.put(dynamoPutParams, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
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
            
        }
        });

    });
};

