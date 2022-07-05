const express = require("express");
const router = express.Router();

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const multer = require("multer");
const { uploadFile } = require("../aws/s3");
const upload = multer({ dest: "uploads/" });

router.get("/:user_id/face-id", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/:user_id/face-id", function (req, res, next) {
  res.send("respond with a resource");
});

//test
router.post("/face-id", upload.array("image", 3), async (req, res, next) => {
  const faceIds = req.files;

  for (const faceIdFile of faceIds) {
    await uploadFile(faceIdFile);
    await unlinkFile(faceIdFile.path);
  }

  res.send({ result: "sucess" });
});

router.get("/:user_id/profile-img", function (req, res, next) {
  res.send("respond with a resource");
});

router.patch("/:user_id/profile-img", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
