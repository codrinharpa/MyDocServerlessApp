const Joi = require('joi');
const AWS = require('aws-sdk');
const Nexmo = require('nexmo');
var randomToken = require('random-token');
const nexmo = new Nexmo({
    apiKey: '049ba857',
    apiSecret: 'DqvTVa8O5chXahnp'
  });
AWS.config.update({
  region: "eu-central-1",
  endpoint: "https://dynamodb.eu-central-1.amazonaws.com"
});
const createSchema = Joi.object().keys({
  doctorEmail: Joi.string().required(),
  appointmentDate: Joi.string().isoDate().required(),
  pacientPhone: Joi.string().regex(/^[0-9]{10}$/).required(),
  appointmentStart: Joi.string().required(),
  appointmentEnd: Joi.string().required(),
  details:Joi.string().allow(''),
});
const docClient = new AWS.DynamoDB.DocumentClient();
module.exports.handler = (event,contex,callback) =>{
    const requestBody = JSON.parse(event.body);
    var authorizer = event.requestContext.authorizer;
    var groups = authorizer.claims['cognito:groups'];
    var clinicEmail = authorizer.claims.email;
    console.log(groups);
    var appointmentAttributes = {
        doctorEmail: requestBody.doctorEmail,
        appointmentDate: requestBody.appointmentDate,
        pacientPhone: requestBody.pacientPhone,
        appointmentStart: requestBody.appointmentStart,
        appointmentEnd: requestBody.appointmentEnd,
        details: requestBody.details
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

    Joi.validate(appointmentAttributes,createSchema,function(err,value){
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

        var getDoctorPromise = docClient.get({
            TableName : 'Doctors',
            Key: {
                email: requestBody.doctorEmail,
            },
        }).promise();
        console.log('inainte de all');
        Promise.all([getPacientPromise, getDoctorPromise]).then(function(results){
            console.log(results);
            var putAppointment = Object.assign({},appointmentAttributes);
            delete putAppointment.appointmentDate;
            putAppointment.timestamp = requestBody.appointmentDate + "-" + requestBody.appointmentStart + "-" + requestBody.appointmentEnd
            putAppointment.pacientFirstname = results[0].Item.firstname;
            putAppointment.pacientSurname = results[0].Item.surname;
            putAppointment.doctorFirstName = results[1].Item.firstname;
            putAppointment.doctorSurname = results[1].Item.surname;
            putAppointment.accessToken = randomToken(16);
            
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
                doctorEmail: requestBody.doctorEmail,
                timestamp: requestBody.appointmentDate + "-" + requestBody.appointmentStart + "-" + requestBody.appointmentEnd
            }
            updatedPacientAppointments.push(pacientAppointmentDetails);
            var putPacient = Object.assign({},results[0].Item);
            putPacient.appointments = updatedPacientAppointments;
            console.log(putPacient);
            var putPacientPromise = docClient.put({
                TableName: 'Pacients',
                Item: putPacient
            }).promise();
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