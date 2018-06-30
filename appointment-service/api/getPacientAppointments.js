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
    var pathParameters = event.pathParameters;
    if(authorizer == undefined){
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"You must provide an Authorization token"
            }),
          });
        return
    }
    docClient.get({
        TableName : 'Pacients',
        Key: {
            phone: pathParameters.phone,
        },
        AttributesToGet: ['appointments']
    }).promise().then(function(data){
        console.log(JSON.stringify(data));
        var batchGetItems = [];
        if(!data.Item.appointments) {
            callback(null,{
                statusCode: 200,
                body: JSON.stringify({
                    appointments: []
                }),
            });
        }
        var params = {
            RequestItems: {
                'Appointments': {
                    Keys: data.Item.appointments
                }
            }
        };
        docClient.batchGet(params, function(err, data) {
            if (err) {
                console.log(err);
                callback(null,{
                    statusCode: 500,
                    body: JSON.stringify({
                        message:"Ups"
                    }),
                });
                return;
            }
            console.log(data);
            callback(null,{
                statusCode: 200,
                body: JSON.stringify({
                    appointments: data.Responses.Appointments
                }),
            });

          });

    }).catch(function(err){
        console.log(err);
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"Ups"
            }),
        });
        return;
    });

    

}