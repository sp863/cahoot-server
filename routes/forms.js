const express = require("express");
const router = express.Router();
const formController = require("./controllers/form.controller");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/new", upload.array("Doc-Form"), formController.uploadNewForm);
router.get("/:project_id", formController.getDocFormsByProject);
router.get("/:form_id", formController.getDocForm);

module.exports = router;
