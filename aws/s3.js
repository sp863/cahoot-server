const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const envKeys = require("../config/envConfig");

const s3 = new S3({
  region: envKeys.AWS_BUCKET_REGION,
  accessKeyId: envKeys.AWS_BUCKET_ACCESS_KEY,
  secretAccessKey: envKeys.AWS_BUCKET_SECRET_KEY,
});

exports.uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: envKeys.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

exports.getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: envKeys.AWS_BUCKET_NAME,
  };

  return s3.getObject(downloadParams).createReadStream();
};
