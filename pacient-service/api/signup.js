'use strict';
global.fetch = require('node-fetch');
const Joi = require('joi');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('../config.json');
const poolData = {
  UserPoolId : config.pacientPoolConfig.UserPoolId,
  ClientId : config.pacientPoolConfig.ClientId
};
var attributeList = [];
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const signUpSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  phone_number: Joi.string().regex(/^(\+)[0-9]{11}$/).required(),
  birthdate: Joi.string().isoDate().required(),
  gender: Joi.string().regex(/^male$|^female$/).required(),
  name: Joi.string().required(),
});


module.exports.handler = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  var username = requestBody.email;
  var password = requestBody.password;
  var pacientAttributes = {
    email: requestBody.email,
    phone_number: requestBody.phone,
    birthdate: requestBody.birthdate,
    gender: requestBody.gender,
    name: requestBody.name
  }
  Joi.validate(pacientAttributes,signUpSchema,function(err,value){
    if(err){
      callback(null,{
        statusCode: 400,
        body: JSON.stringify({
          message: err
        }),
      });
      return;
    }
    else{
      console.log(pacientAttributes);
      Object.keys(pacientAttributes).forEach(function(key){
        var attribute = new AmazonCognitoIdentity.CognitoUserAttribute({
          Name:key,
          Value:requestBody[key]
        });
        attributeList.push(attribute);
      });
      console.log(attributeList);
      userPool.signUp(username,password,attributeList,null,function(err,result){
        if(err){
          console.log(err)
          callback(null,{
            statusCode: 400,
            body: JSON.stringify({
              message: 'Failed',
              input: err,
            }),
          });
          return;
        }
        callback(null,{
          statusCode: 201,
          body: JSON.stringify({
            response: result
          }),
        });
        
      });

    }
  })
  
};

