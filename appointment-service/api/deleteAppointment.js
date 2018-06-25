const Joi = require('joi');
const AWS = require('aws-sdk');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: '049ba857',
    apiSecret: 'DqvTVa8O5chXahnp'
  });
AWS.config.update({
  region: "eu-central-1",
  endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
});
const deleteSchema = Joi.object().keys({
    doctorEmail: Joi.string().required(),
    timestamp: Joi.string().required(),
    pacientPhone: Joi.string().regex(/^[0-9]{10}$/).required(),
});
const docClient = new AWS.DynamoDB.DocumentClient();
module.exports.handler = (event,contex,callback) =>{
    const requestBody = JSON.parse(event.body);
    var authorizer = event.requestContext.authorizer;

    if(authorizer == undefined){
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"You must provide an Authorization token"
            }),
          });
        return
    }

    Joi.validate(requestBody,deleteSchema,function(err,value){
        if(err){
            console.log(err);
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

        docClient.get({
            TableName : 'Pacients',
            Key: {
                phone: requestBody.pacientPhone
            },
        }).promise().then(function(data){
            if(data.Item.appointments){
                updatedPacientAppointments = data.Item.appointments;
            } else {
                updatedPacientAppointments = [];
            }
            for(let i = 0 ; i < updatedPacientAppointments.length ; i++){
                if(updatedPacientAppointments[i].doctorEmail == requestBody.doctorEmail &&
                    updatedPacientAppointments[i].timestamp == requestBody.timestamp){
                        console.log('sunt egale astea doua');
                        updatedPacientAppointments.splice(i,1);
                    }
            }
            var putPacient = Object.assign({},data.Item);
            putPacient.appointments = updatedPacientAppointments;
            console.log(putPacient);
            var putPacientPromise = docClient.put({
                TableName: 'Pacients',
                Item: putPacient
            }).promise();
            var deleteAppointmentPromise = docClient.delete({
                TableName: 'Appointments',
                Key: {
                    doctorEmail: requestBody.doctorEmail,
                    timestamp: requestBody.timestamp
                }
            }).promise();
            Promise.all([deleteAppointmentPromise,putPacientPromise]).then(function(results){
                // const from = 'Doctorul Meu';
                // const to = '4' + appointmentAttributes.pacientPhone;
                // const text = 'O programare a fost creeata pentru dumneavoastra in ziua de ' + appointmentAttributes.date
                // + " ora " + appointmentAttributes.start ;

                // nexmo.message.snewAppointmentEndSms(from, to, text, (error, response) => {
                // if(error) {
                //     throw error;
                // } else if(response.messages[0].status != '0') {
                //     console.error(response);
                //     throw 'Nexmo returned back a non-zero status';
                // } else {
                //     console.log(response);
                //     callback(null,{
                //         statusCode: 201,
                //         body: JSON.stringify({
                //             headers: {
                //                 'Access-Control-Allow-Origin': '*',
                //                 'Access-Control-Allow-Credentials': true,
                //             },
                //             message: "Created"
                //         }),
                //     });
                // }
                // });
                console.log(results[0]);
                console.log('stergem'); 
                callback(null,{
                    statusCode: 200,
                    body: JSON.stringify({
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        },
                        message: "Deleted"
                    }),
                });
            }).catch(function(err){
                console.log(err);
            });

        }).catch(function(err){
            console.log(err);
            callback(null,{
                statusCode: 500,
                body: JSON.stringify({
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                message: err
                }),
            });
            return;
        });
    });
    

}