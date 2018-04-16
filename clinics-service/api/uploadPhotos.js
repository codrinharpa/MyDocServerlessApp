const AWS = require('aws-sdk');
var s3 = new AWS.S3();

var callsToFinish = 0;
function uploadImageToS3(image,filePath,imagesHandler){
  let decodedImage = new Buffer(image.replace(/^data:image\/\w+;base64,/, ""),'base64');
        var params = {
          "Body": decodedImage,
          "Bucket": 'clinics-photos',
          "Key": filePath,
          ContentEncoding: 'base64',
          ContentType: 'image/jpeg'
        };
        s3.upload(params, imagesHandler);
}
function deleteImageFromS3(filePath,imagesHandler){
        var params = {
          "Bucket": 'clinics-photos',
          "Key": filePath
        };
        s3.deleteObject(params, imagesHandler);
}


module.exports.handler = (event, context, callback) => {
    console.log(event.requestContext.authorizer);
    var authorizer = event.requestContext.authorizer;
    if(authorizer == undefined){
        callback(null,{
            statusCode: 500,
            body: JSON.stringify({
                message:"You must provide an Authorization token"
            }),
          });
    }
    else{
        var email = authorizer.claims.email;
        var body = JSON.parse(event.body);
        if(!body instanceof Array){
          callback(null,{
            statusCode: 400,
            body: JSON.stringify({
                message:"You need to specify an array of image operations"
            }),
          });
        }
        for(var i = 0 ; i < body.length ; i++){
          var imageParams = body[i];
          if(typeof imageParams.number == 'undefined'){
            callback(null,{
              statusCode: 400,
              body: JSON.stringify({
                  message:"Each image operation should have a number to apply the operation to"
              }),
            });
          }
          else{
            if(imageParams.number > 10){
              callback(null,{
                statusCode: 400,
                body: JSON.stringify({
                    message:"The maximum number of photos allowed for clinics is 10"
                }),
              });
              return;
            }
            var filePath = email +'/' + imageParams.number.toString() + ".jpg";
            if(typeof imageParams.operation == 'undefined'){
              callback(null,{
                statusCode: 400,
                body: JSON.stringify({
                    message:"Each image operation must contain an put/delete operation"
                }),
              });
            }
            switch (imageParams.operation){
              case "put":
                if(imageParams.image == undefined){
                  callback(null,{
                    statusCode: 400,
                    body: JSON.stringify({
                        message:"Put operation must specify an base64 encoded image"
                    }),
                  });
                }
                else{
                  ++callsToFinish ;
                  uploadImageToS3(imageParams.image,filePath,imagesOperationsHandler);
                }
                break;
              case "delete":
                ++callsToFinish ;
                deleteImageFromS3(filePath,imagesOperationsHandler);
                break;
              default:
                callback(null,{
                  statusCode: 400,
                  body: JSON.stringify({
                      message:"Unknown operation"
                  }),
                });
            }
          }
          



          function imagesOperationsHandler(err,data){
            console.log('Suntem in images UploadHandler');
            console.log(err,data);
            if(err){
              callback(null,{
                statusCode: 500,
                body: JSON.stringify({
                    message:"There was a problem with one or more operations you have provided. Please try again"
                }),
              });
            }
            else{
              --callsToFinish;
              if(callsToFinish == 0){
                callback(null,{
                  statusCode: 200,
                  body: JSON.stringify({
                      message:"Successfully updated photos"
                  }),
                });
              }
            }
            
          }
        }
    }
};