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
  phone: Joi.string().regex(/^(\+)[0-9]{11}$/).required(),
  firstname: Joi.string().required(),
  surname: Joi.string().required(),
});
module.exports.handler = (event,contex,callback) =>{
    const requestBody = JSON.parse(event.body);
    var doctorAttributes = {
        email: requestBody.email,
        phone: requestBody.phone,
        firstname: requestBody.firstname,
        surname: requestBody.surname
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
        else{
            var data = {
                UserAttributes: [ 
                    { 
                        Name: "custom:firstname",
                        Value: doctorAttributes.firstname
                    },
                    { 
                        Name: "custom:surname",
                        Value: doctorAttributes.surname
                    },
                    { 
                        Name: "custom:phone",
                        Value: doctorAttributes.phone
                    },

                ],
                Username: doctorAttributes.email,
                UserPoolId: poolData.UserPoolId,
            }
            cognitoidentityserviceprovider.adminCreateUser(data,function(err,data){
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
                else{
                    var docClient = new AWS.DynamoDB.DocumentClient();
                    var table = "DoctorsToClinics";
                    var clinic = "trilulilu";
                    var title = "The Big New Movie";

                    var params = {
                        TableName:table,
                        Item:{
                            "clinicEmail": clinic,
                            "doctorEmail": doctorAttributes.email
                        }
                    };
                    docClient.put(params, function(err, data) {
                        if (err) {
                            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                            callback(null,{
                                statusCode: 400,
                                body: JSON.stringify({
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Credentials': true,
                                },
                                message: "Ups"
                                }),
                            });
                        } else {
                            console.log("Added item:", JSON.stringify(data, null, 2));
                            callback(null,{
                                statusCode: 201,
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Credentials': true,
                                },
                                body: JSON.stringify({
                                message: data
                                }),
                            });
                            return;
                        }
                    });
                }
            });

        }
        
    });

}