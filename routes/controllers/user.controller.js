const { getFileStream, getFile, getFileUrl } = require("../../aws/s3");
const User = require("../../models/User");

exports.registerFaceId = async (req, res, next) => {};

exports.getUserProfileImageUrl = async (req, res, next) => {
  const { user_id } = req.params;

  const user = await User.findOne({ _id: user_id }).lean();

  if (!user) return res.status(401).send({ result: "failure" });

  // const imageDataStream = await getFile(user.profileImageKey);
  // const buffer = Buffer.from(imageDataStream.Body);
  // const imageBase64 = buffer.toString("base64");

  const imageUrl = await getFileUrl(user.profileImageKey);

  res.send(imageUrl);
};

exports.getUserProjects = async (req, res, next) => {
  const { user_id } = req.params;

  const user = await User.findById(user_id).populate("projects").lean();

  if (!user) return res.status(401).send({ result: "failure" });

  res.send(user.projects);
};
