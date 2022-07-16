const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const envKeys = require("../../config/envConfig");
const { getFileUrl } = require("../../aws/s3");

exports.createUser = async (req, res, next) => {
  const { name, organization, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) return res.status(409).send({ result: "failure" }); //409

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    name,
    organization,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return res.send({ result: "success" });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(401).send({ result: "failure" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(401).send({ result: "failure" });

  const accessToken = jwt.sign({ email }, envKeys.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ email }, envKeys.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  const userImageUrl = await getFileUrl(user.profileImageKey);

  user.refreshToken = refreshToken;
  user.firstTime = false;
  await user.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.send({
    result: "success",
    user: {
      email: user.email,
      name: user.name,
      firstTime: user.firstTime,
      organization: user.organization,
      profilePicture: user.profilePicture,
      user_id: user._id,
      imageUrl: userImageUrl,
    },
    accessToken,
  });
};

exports.logoutUser = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(204).send({ result: "success" }); //No content

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(204).send({ result: "success" });
  }

  user.refreshToken = "";
  await user.save();

  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // secure: true - only serves on https

  res.status(204).send({ result: "success" });
};

exports.handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).send({ result: "failure" });

  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });

  if (!user) return res.status(403).send({ result: "failure" });

  const userImageUrl = await getFileUrl(user.profileImageKey);

  jwt.verify(refreshToken, envKeys.REFRESH_TOKEN_SECRET, (error, decoded) => {
    if (error || user.email !== decoded.email) {
      return res.status(403).send({ result: "failure" });
    }

    const accessToken = jwt.sign(
      { email: decoded.email },
      envKeys.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
    );

    return res.send({
      result: "success",
      user: {
        email: user.email,
        name: user.name,
        firstTime: user.firstTime,
        organization: user.organization,
        profilePicture: user.profilePicture,
        user_id: user._id,
        imageUrl: userImageUrl,
      },
      accessToken,
    });
  });
};
