'use strict';
const Joi = require('joi');
const AWS = require('aws-sdk');
const createPacientSchema = Joi.object().keys({
  email: Joi.string().email().allow(''),
  phone: Joi.string().regex(/^[0-9]{10}$/).required(),
  birthdate: Joi.string().isoDate().required(),
  gender: Joi.string().regex(/^male$|^female$/).required(),
  firstname: Joi.string().required(),
  surname: Joi.string().required(),
  city:Joi.string().allow(''),
});

AWS.config.update({
    region: "eu-central-1",
    endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
  });
const docClient = new AWS.DynamoDB.DocumentClient();
module.exports.handler = (event, context, callback) => {

    const requestBody = JSON.parse(event.body);
    var authorizer = event.requestContext.authorizer;
    var groups = authorizer.claims['cognito:groups'];
    if(authorizer == undefined){
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"You must provide an Authorization token"
            }),
          });
        return
    }
    var pacient = requestBody;
    var clinicEmail = null;
    if(groups.includes('Clinics')){
        clinicEmail = authorizer.claims.email;
    }
    else if(groups.includes('Doctors')){
        clinicEmail = authorizer.claims.clinicEmail;
    }

    Joi.validate(pacient,createPacientSchema,function(err,value){
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
            var putPacient = Object.assign({},pacient);
            putPacient.clinicEmail = clinicEmail;
            var dynamoPutPromise = docClient.put({
                TableName:'Pacients',
                Item:putPacient
            }).promise();
            var addPacientToClinicPromise = docClient.get({
                Key: { 
                    "email":clinicEmail
                },
                AttributesToGet: [
                    "pacientsPhones"
                ],
                TableName: 'Clinics', /* required */
            }).promise().then(function(getPhonesResponse){
                var updatedPacientsPhones = [];
                if(getPhonesResponse.Item.pacientsPhones){
                    updatedPacientsPhones = getPhonesResponse.Item.pacientsPhones;
                }
        
                updatedPacientsPhones.push(pacient.phone);
                return docClient.update({
                    TableName:'Clinics',
                    Key:{
                        "email":clinicEmail
                    },
                    UpdateExpression: "set pacientsPhones = :pacientsPhones",
                    ExpressionAttributeValues:{
                        ":pacientsPhones": updatedPacientsPhones
                    }
                }).promise();
            });
            Promise.all([addPacientToClinicPromise,dynamoPutPromise]).then(function(values){
                console.log('success');
                callback(null,{
                    statusCode: 200,
                    body: JSON.stringify({
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        },
                        message: "Created"
                    }),
                });
            }).catch(function(err){
                console.log(err)
                callback(null,{
                    statusCode: 500,
                    body: JSON.stringify({
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        },
                        message: err + "Ups. Unable to create the pacient"
                    }),
                });
            });

        }
    
    });

  
};

