const Joi = require('joi');
const AWS = require('aws-sdk');
var randomToken = require('random-token');
AWS.config.update({
  region: "eu-central-1",
  endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
});
const docClient = new AWS.DynamoDB.DocumentClient();
module.exports.handler = (event,contex,callback) =>{
    var authorizer = event.requestContext.authorizer;
    var parameters = event.queryStringParameters;
    if(authorizer == undefined){
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"You must provide an Authorization token"
            }),
          });
        return
    }
    if(parameters.start > parameters.end ){
        callback(null,{
            statusCode: 400,
            body: JSON.stringify({
                message:"Start timestamp must be before end timestamp"
            }),
        });
        return
    }
    var queryParams = {  
        TableName: 'Appointments',
        KeyConditionExpression: "#doctorEmail = :doctorEmail and #timestamp between :start and :end",
        ExpressionAttributeNames:{
            "#doctorEmail": 'doctorEmail',
            "#timestamp": 'timestamp'
        },
        ExpressionAttributeValues: {
            ":doctorEmail": parameters.doctorEmail,
            ":start": parameters.start,
            ":end": parameters.end
        }
    };
    docClient.query(queryParams).promise().then(function(data){
        console.log(data);
        callback(null,{
            statusCode: 200,
            body: JSON.stringify({
                appointments: data.Items
            }),
          });
        return
    }).catch(function(err){
        console.log(err);
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"Ups"
            }),
          });
        return
    });
}