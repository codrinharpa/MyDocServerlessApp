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
const updateSchema = Joi.object().keys({
  doctorEmail: Joi.string().required(),
  timestamp: Joi.string().required(),
  pacientPhone: Joi.string().regex(/^[0-9]{10}$/).required(),
  newAppointmentDate: Joi.string().isoDate().required(),
  newAppointmentStart: Joi.string().required(),
  newAppointmentEnd: Joi.string().required(),
});
const docClient = new AWS.DynamoDB.DocumentClient();
module.exports.handler = (event,contex,callback) =>{
    const requestBody = JSON.parse(event.body);
    var authorizer = event.requestContext.authorizer;
    var groups = authorizer.claims['cognito:groups'];
    console.log(groups);
    var appointmentAttributes = {
        doctorEmail: requestBody.doctorEmail,
        appointmentDate: requestBody.newAppointmentDate,
        pacientPhone: requestBody.pacientPhone,
        appointmentStart: requestBody.newAppointmentStart,
        appointmentEnd: requestBody.newAppointmentEnd,
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

    Joi.validate(requestBody,updateSchema,function(err,value){
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

        var getPacientPromise = docClient.get({
            TableName : 'Pacients',
            Key: {
                phone: requestBody.pacientPhone
            },
        }).promise();

        var getAppointmentPromise = docClient.get({
            TableName : 'Appointments',
            Key: {
                doctorEmail: requestBody.doctorEmail,
                timestamp: requestBody.timestamp
            },
        }).promise();
        console.log('inainte de all');
        Promise.all([getPacientPromise, getAppointmentPromise]).then(function(results){
            console.log(results);
            var putAppointment = Object.assign({},appointmentAttributes);
            putAppointment.timestamp = requestBody.newAppointmentDate + "-" + requestBody.newAppointmentStart + "-" + requestBody.newAppointmentEnd;
            putAppointment.accessToken = results[1].Item.accessToken;
            putAppointment.doctorFirstname = results[1].Item.doctorFirstname;
            putAppointment.doctorSurname = results[1].Item.doctorSurname;
            putAppointment.pacientFirstname = results[1].Item.pacientFirstname;
            putAppointment.pacientSurname = results[1].Item.pacientSurname;
            putAppointment.details = results[1].Item.delails;
            var putAppointmentPromise = docClient.put({
                TableName: 'Appointments',
                Item: putAppointment
            }).promise();
            var updatedPacientAppointments = [];
            if(results[0].Item.appointments){
                updatedPacientAppointments = results[0].Item.appointments;
            } else {
                updatedPacientAppointments = [];
            }
            var pacientAppointmentDetails = {
                doctorEmail: appointmentAttributes.doctorEmail,
                timestamp: appointmentAttributes.appointmentDate + "-" + appointmentAttributes.appointmentStart + "-" + appointmentAttributes.appointmentEnd
            }
            for(let i = 0 ; i < updatedPacientAppointments.length ; i++){
                if(updatedPacientAppointments[i].doctorEmail == pacientAppointmentDetails.doctorEmail &&
                    updatedPacientAppointments[i].timestamp == requestBody.timestamp){
                        updatedPacientAppointments.splice(i,1);
                    }
            }
            updatedPacientAppointments.push(pacientAppointmentDetails);
            var putPacient = Object.assign({},results[0].Item);
            putPacient.appointments = updatedPacientAppointments;
            console.log(putPacient);
            var putPacientPromise = docClient.put({
                TableName: 'Pacients',
                Item: putPacient
            }).promise();

            docClient.delete({
                TableName: 'Appointments',
                Key: {
                    doctorEmail: requestBody.doctorEmail,
                    timestamp: requestBody.timestamp
                }
            }).promise().then(function(data){
                console.log('succes');
            }).catch(function(err){
                console.log(err);
                callback(null,{
                    statusCode: 500,
                    body: JSON.stringify({
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        },
                        message: "Ups"
                    }),
                });
            });
            Promise.all([putAppointmentPromise,putPacientPromise]).then(function(putResults){
                // const from = 'Doctorul Meu';
                // const to = '4' + appointmentAttributes.pacientPhone;
                // const text = 'O programare a fost creeata pentru dumneavoastra in ziua de ' + appointmentAttributes.date
                // + " ora " + appointmentAttributes.start ;

                // nexmo.message.sendSms(from, to, text, (error, response) => {
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
                console.log('punem'); 
                callback(null,{
                    statusCode: 201,
                    body: JSON.stringify({
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Credentials': true,
                        },
                        message: "Created"
                    }),
                });
            }).catch(function(err){
                console.log(err);
            });
                
        }).catch(function(err){
            console.log(err);

        });
    });
    

}