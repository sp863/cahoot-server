const express = require("express");
const router = express.Router();
const projectController = require("./controllers/project.controller");

router.post("/new", projectController.createProject);
router.get("/:project_id/forms", projectController.getDocFormsByProject);
router.get("/:project_id", projectController.getProject);
router.post("/:project_id/tasks/new", projectController.createTask);
router.patch("/:project_id/tasks/:task_id", projectController.updateTask);
router.post("/:project_id/invite", projectController.sendInvite);
router.patch("/invite/verify", projectController.verifyInvite);
router.patch("/:project_id/github", projectController.updateGithub);

module.exports = router;
