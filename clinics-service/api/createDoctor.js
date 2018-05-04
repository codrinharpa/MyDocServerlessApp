const Joi = require('joi');
const config = require('../config.json');
const AWS = require('aws-sdk');
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const poolData = {
  UserPoolId : config.clinicsDoctorsPool.UserPoolId,
  ClientId : config.clinicsDoctorsPool.ClientId
};

AWS.config.update({
  region: "eu-central-1",
  endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
});

var attributeList = [];
// const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const signUpSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/^[0-9]{10}$/).required(),
  firstname: Joi.string().required(),
  surname: Joi.string().required(),
  specialization:Joi.string(),

});
const docClient = new AWS.DynamoDB.DocumentClient();
module.exports.handler = (event,contex,callback) =>{
    const requestBody = JSON.parse(event.body);
    var authorizer = event.requestContext.authorizer;
    var groups = authorizer.claims['cognito:groups'];
    var clinicEmail = authorizer.claims.email;
    console.log(groups);
    var doctorAttributes = {
        email: requestBody.email,
        phone: requestBody.phone,
        firstname: requestBody.firstname,
        surname: requestBody.surname,
        specialization: requestBody.specialization,
    }

    if(authorizer == undefined){
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"You must provide an Authorization token"
            }),
          });
        return
    }
    if(!groups.includes('Clinics')){
        callback(null,{
            statusCode: 400,
            body: JSON.stringify({
                message:"You are not logged in as a Clinic"
            }),
        });
        return;
    }

    Joi.validate(doctorAttributes,signUpSchema,function(err,value){
        if(err){
            callback(null,{
                statusCode: 400,
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
        cognitoidentityserviceprovider.adminCreateUser({
            Username: doctorAttributes.email,
            UserPoolId: poolData.UserPoolId,
        }).promise().then(function(data){
            var addToClinicsPromise = cognitoidentityserviceprovider.adminAddUserToGroup({
                GroupName: 'Doctors', /* required */
                UserPoolId: config.clinicsDoctorsPool.UserPoolId, /* required */
                Username: data.User.Username /* required */
            }).promise();

            var addDoctorToClinicPromise = docClient.get({
                Key: { 
                    "email":clinicEmail
                },
                AttributesToGet: [
                    "doctorsEmails"
                ],
                TableName: 'Clinics', /* required */
            }).promise().then(function(getEmailsResponse){
                var updatedDoctorsEmails = [];
                if(getEmailsResponse.Item.doctorsEmails){
                    updatedDoctorsEmails = getEmailsResponse.Item.doctorsEmails;
                }
                console.log(updatedDoctorsEmails);
                updatedDoctorsEmails.push(doctorAttributes.email);
                return docClient.update({
                    TableName:'Clinics',
                    Key:{
                        "email":clinicEmail
                    },
                    UpdateExpression: "set doctorsEmails = :doctorsEmails",
                    ExpressionAttributeValues:{
                        ":doctorsEmails": updatedDoctorsEmails
                    }
                }).promise();
            });
            doctorAttributes.clinicEmail = clinicEmail; 
            var createDoctorDetailsPromise = docClient.put({
                TableName:'Doctors',
                Item:doctorAttributes
            }).promise();
            
            
            Promise.all([addToClinicsPromise,addDoctorToClinicPromise,createDoctorDetailsPromise]).then(function(values){
                callback(null,{
                    statusCode: 201,
                    body: JSON.stringify({
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        },
                        message: 'Created'
                    }),
                });
                return;
            }).catch(function(err){
                callback(null,{
                    statusCode: 500,
                    body: JSON.stringify({
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        },
                        message: err + "Ups. Unable to Add the doctor"
                    }),
                });
                return;
            });
            
        }).catch(function(err){
            callback(null,{
                statusCode: 500,
                body: JSON.stringify({
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    message: err + "Ups. Unable to Add the doctor"
                }),
            });
            return;
        });
        
    });
    

}