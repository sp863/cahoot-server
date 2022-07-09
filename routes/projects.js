const express = require("express");
const router = express.Router();
const projectController = require("./controllers/project.controller");

router.post("/new", projectController.createProject);
router.get("/:project_id/forms", projectController.getDocFormsByProject);

module.exports = router;
