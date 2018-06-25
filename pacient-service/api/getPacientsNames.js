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
    docClient.get({
        TableName : 'Clinics',
        Key: {
            email: clinicEmail,
        },
        AttributesToGet: ['pacientsPhones']
    }).promise().then(function(data){
        console.log(JSON.stringify(data));
        var keysMap = data.Item.pacientsPhones.map(x => ({phone: x}));
        console.log(keysMap);
        var params = {
            RequestItems: {
                'Pacients': {
                    Keys: keysMap
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
                    pacients: data.Responses.Pacients
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

  
};

