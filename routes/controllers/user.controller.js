const User = require("../../models/User");
const { getFile, getFileUrl, uploadFile } = require("../../aws/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

exports.registerFaceId = async (req, res, next) => {
  const { user_id } = req.params;
  const faceIds = req.files;

  const user = await User.findById(user_id);

  if (!user) return res.status(401).send({ result: "failure" });

  for (const faceIdFile of faceIds) {
    await uploadFile(faceIdFile);
    await unlinkFile(faceIdFile.path);
  }

  user.faceId = faceIds.map((faceId) => faceId.filename);

  await user.save();

  res.send({ result: "sucess" });
};

exports.getUserFaceId = async (req, res, next) => {
  const { user_id } = req.params;

  const user = await User.findOne({ _id: user_id }).lean();

  if (!user) return res.status(401).send({ result: "failure" });
  if (!user.faceId.length) return res.status(404).send({ result: "failure" });

  const faceIdImageUrls = [];

  for (const faceIdKey of user.faceId) {
    const imageFile = await getFile(faceIdKey);
    const base64String = imageFile.Body.toString("base64");

    faceIdImageUrls.push("data:image/png;base64," + base64String);
  }

  res.send(faceIdImageUrls);
};

exports.getUserProfileImageUrl = async (req, res, next) => {
  const { user_id } = req.params;

  const user = await User.findOne({ _id: user_id }).lean();

  if (!user) return res.status(401).send({ result: "failure" });

  const imageUrl = await getFileUrl(user.profileImageKey);

  res.send(imageUrl);
};

exports.getUserProjects = async (req, res, next) => {
  const { user_id } = req.params;

  const user = await User.findById(user_id).populate("projects").lean();

  if (!user) return res.status(401).send({ result: "failure" });

  res.send(user.projects);
};
