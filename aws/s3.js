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

exports.uploadPdfFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: envKeys.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
    ContentType: "application/pdf",
  };

  return s3.upload(uploadParams).promise();
};

exports.getFile = async (fileKey) => {
  const file = await s3
    .getObject({ Bucket: envKeys.AWS_BUCKET_NAME, Key: fileKey })
    .promise();

  return file;
};

exports.getFileUrl = async (fileKey) => {
  const signedUrl = await s3.getSignedUrl("getObject", {
    Key: fileKey,
    Bucket: envKeys.AWS_BUCKET_NAME,
  });

  return signedUrl;
};

exports.getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: envKeys.AWS_BUCKET_NAME,
  };

  return s3.getObject(downloadParams).createReadStream();
};

exports.deleteFile = async (fileKey) => {
  await s3
    .deleteObject({ Bucket: envKeys.AWS_BUCKET_NAME, Key: fileKey })
    .promise();
};
