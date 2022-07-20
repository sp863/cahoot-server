const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const usersController = require("./controllers/user.controller");

router.get("/:user_id/projects", usersController.getUserProjects);
router.get("/:user_id/profile-image", usersController.getUserProfileImageUrl);
router.get("/:user_id/face-id", usersController.getUserFaceId);
router.patch(
  "/:user_id/profile-image",
  upload.single("Profile-Image"),
  usersController.updateProfileImage,
);
router.post(
  "/:user_id/face-id/new",
  upload.array("newFaceID"),
  usersController.registerFaceId,
);

module.exports = router;
