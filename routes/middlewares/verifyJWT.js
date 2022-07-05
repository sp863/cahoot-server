const jwt = require("jsonwebtoken");
const envKeys = require("../../config/envConfig");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).send({ result: "failure" });

  console.log(authHeader);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, envKeys.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ result: "failure" });
    req.user = decoded.email;
    next();
  });
};

module.exports = verifyJWT;
