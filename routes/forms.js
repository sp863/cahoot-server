const express = require("express");
const router = express.Router();
const formController = require("./controllers/form.controller");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/new", upload.array("Doc-Form"), formController.uploadNewForm);
router.get("/:project_id/forms", formController.getDocFormsByProject);
router.get("/:form_id", formController.getDocForm);
router.patch("/:form_id/sign", formController.signDocForm);
router.patch(
  "/:form_id/images",
  upload.array("Signed-Page"),
  formController.uploadFormImages,
);

module.exports = router;
