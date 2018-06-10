'use strict';
const AWS = require('aws-sdk');

AWS.config.update({
    region: "eu-central-1",
    endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
  });
const docClient = new AWS.DynamoDB.DocumentClient();
module.exports.handler = (event, context, callback) => {

    const requestBody = JSON.parse(event.body);
    var authorizer = event.requestContext.authorizer;
    console.log(authorizer);
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
    var params = {
        TableName: "Pacients",
        KeyConditionExpression: "#clinicEmail = :clinicEmail",
        ExpressionAttributeNames:{
            "#clinicEmail": "clinicEmail"
        },
        ExpressionAttributeValues: {
            ":clinicEmail":clinicEmail
        },
        ProjectionExpression: "phone,firstname,surname",
    }
    docClient.query(params,function(err, data){
        if(err){
            console.log(err);
            callback(null,{
                statusCode: 500,
                body: JSON.stringify({
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                        'Access-Control-Allow-Headers': 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With',
                        'Access-Control-Allow-Methods': 'GET, PUT, POST"'
                    },
                    message: "Unexpected error"
                }),
            });
            return;
        }
        else{
            console.log(data);
            callback(null,{
                statusCode: 200,
                body: JSON.stringify({
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                        'Access-Control-Allow-Headers': 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With',
                        'Access-Control-Allow-Methods': 'GET, PUT, POST"'
                    },
                    pacients: data.Items
                }),
            });
        }
    });

  
};
