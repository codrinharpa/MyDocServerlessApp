'use strict';
// global.fetch = require('node-fetch');
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
    var pathParameters = event.pathParameters;
    var practiceType = decodeURI(pathParameters.practiceType);
    var params = {
        TableName : 'PracticeSpecializations',
        AttributesToGet: [
            "specializations"
        ],
        Key : { 
            "practiceType" : practiceType
        }
      };
      
    docClient.get(params, function(err, data) {
        if (err) {
            console.log(err);
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
            console.log(data);
            callback(null,{
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    specializations: data.Item.specializations
                }),
            });
            return;
        }

    });
};

