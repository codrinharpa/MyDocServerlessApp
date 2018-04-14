const AWS = require('aws-sdk');
const fs = require('fs');
function hello(){
    return "Hello";
}
module.exports.handler = (event, context, callback) => {
    var pacientId = event.pathParameters.id;
    var pacientSub = event.requestContext.authorizer.claims.sub;
    if(pacientId != pacientSub || pacientId == undefined || pacientSub ==undefined){
        callback(null,{
            statusCode: 401,
            body: JSON.stringify({
                message:"You are not authorized for this resource"
            }),
          });
    }
    else{
        callback(null,{
            statusCode: 401,
            body: JSON.stringify({
                message: hello()
            }),
          });
    }
       
};

//  const s3 = new AWS.S3();
//         const body = JSON.parse(event.body);
//         const fileBuffer = new Buffer(body['image'], 'base64');
//         console.log(fileBuffer.toString());
//         // fs.writeFile('/tmp/upload.png', fileBuffer, function (err) {
//         //     if (err) return next(err)
        
//         //     res.end('Success!')
//         //   })
//         if (fileBuffer.length < 500000) {

//             var param = {
//                 Bucket: 'pacients-profile-photos',
//                 Key: pacientSub,
//                 Body: fileBuffer.toString()
//             };

//             s3.upload(param, function(err,data){
//                 if(err){
//                     console.log(err);
//                     callback(null,{
//                         statusCode: 400,
//                         body: JSON.stringify({
//                             message:"error",
//                             error: err
//                         }),
//                     });
//                 }
//                 else{
//                     callback(null,{
//                         statusCode: 200,
//                         body: JSON.stringify({
//                             message:"Uploaded Photo",
//                             data: data
//                         }),
//                     });
//                 }
//             });
//         }
//     }