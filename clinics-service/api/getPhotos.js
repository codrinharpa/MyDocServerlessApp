const AWS = require('aws-sdk');
var s3 = new AWS.S3();
const signedUrlExpireSeconds = 60 * 120;
function getS3SignedUrls(imageKeys){
    var urlPromises = [];
    for(var i = 0 ; i < imageKeys.length; i++){
        console.log(imageKeys[i]);
        var params = {
            Bucket: 'clinics-photos',
            Key: imageKeys[i],
            Expires: signedUrlExpireSeconds
        };
        console.log(params);
        urlPromises.push(new Promise((resolve,reject) => {
            s3.getSignedUrl('getObject', params, (err, url) => {
                    if(err) reject(err);
                    else resolve(url);
                });
            }
        ));
    };
    return Promise.all(urlPromises);

}
module.exports.handler = (event,contex,callback) =>{

    var pathParameters = event.pathParameters;
    if(pathParameters == undefined){
        callback(null,{
            statusCode: 400,
            body: JSON.stringify({
                message:"Specify path parameter"
            }),
        });
        return;
    }
    var listParams = {
        Bucket: 'clinics-photos', /* required */
        Prefix: pathParameters.email,
      };
      s3.listObjects(listParams).promise()
        .then(function(data) {
            var imageKeys = data.Contents.map(a => a.Key);
            getS3SignedUrls.apply(this,[imageKeys])
            .then(function(data){
                callback(null,{
                    statusCode: 200,
                    body: JSON.stringify({
                        message:data
                    }),
                  });
            }).catch(function(err){
                callback(null,{
                    statusCode: 500,
                    body: JSON.stringify({
                        message:err
                    }),
                  });
            });
        }).catch( function(err){
            callback(null,{
                statusCode: 500,
                body: JSON.stringify({
                    message:err
                }),
            });
        });
    
}