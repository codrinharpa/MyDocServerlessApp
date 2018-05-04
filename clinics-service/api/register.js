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


const signUpSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
  phone: Joi.string().regex(/^[0-9]{10}$/).required(),
  name: Joi.string().required(),
  practiceType: Joi.string().required(),
  city: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude:Joi.string().required()
});
module.exports.handler = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);

  var clinicAttributes = {
    email: requestBody.email,
    password: requestBody.password,
    phone: requestBody.phone,
    name: requestBody.name,
    practiceType: requestBody.practiceType,
    city:requestBody.city,
    latitude: requestBody.latitude,
    longitude: requestBody.longitude
  }
  Joi.validate(clinicAttributes,signUpSchema,function(err,value){
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
    userPool.signUp(clinicAttributes.email,clinicAttributes.password,attributeList,null,function(err,result){
      if(err){
        callback(null,{
          statusCode: 400,
          body: JSON.stringify({
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            message: 'Failed',
            input: err,
          }),
        });
        return;
      }
      var addToClinicsGroupParams = {
        GroupName: 'Clinics', /* required */
        UserPoolId: config.clinicsDoctorsPool.UserPoolId, /* required */
        Username: result.userSub /* required */
      };
      cognitoidentityserviceprovider.adminAddUserToGroup(addToClinicsGroupParams, function(err, data) {
        if (err) {
          callback(null,{
            statusCode: 500,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
              response: err,
            }),
          });
          return;
        }
        var dynamoPutParams = {
          TableName:'Clinics',
          Item:{
              email : clinicAttributes.email,
              phone: clinicAttributes.phone,
              name: clinicAttributes.name,
              practiceType: clinicAttributes.practiceType,
              city:clinicAttributes.city,
              latitude: clinicAttributes.latitude,
              longitude: clinicAttributes.longitude
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
                callback(null,{
                    statusCode: 201,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({
                    user: result
                    }),
                });
                return;
            }
          });
    
      });
    });
  });
};

