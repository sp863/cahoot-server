const Project = require("../../models/Project");
const Form = require("../../models/Form");
const User = require("../../models/User");
const { default: mongoose } = require("mongoose");
const { getFileUrl } = require("../../aws/s3");
const Task = require("../../models/Task");

exports.createProject = async (req, res, next) => {
  const { name, user_id } = req.body;

  const user = await User.findById(user_id);

  if (!user) return res.status(409).send({ result: "failure" });

  const newProject = new Project({
    name,
    participants: [user],
  });

  user.projects.push(newProject);

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  await newProject.save({ session: mongoSession });
  await user.save({ session: mongoSession });

  await mongoSession.commitTransaction();
  mongoSession.endSession();

  return res.send({ result: "success" });
};

exports.getProject = async (req, res, next) => {
  const { project_id } = req.params;

  const project = await Project.findById(project_id)
    .populate("participants")
    .populate("tasks")
    .lean();

  if (!project) return res.status(404).send({ result: "failure" });

  const memberImageKeys = project.participants.map(
    (member) => member.profileImageKey,
  );

  const memberImageUrls = [];

  for (const imageKey of memberImageKeys) {
    const url = await getFileUrl(imageKey);

    memberImageUrls.push(url);
  }

  for (const [index, member] of project.participants.entries()) {
    member.imageUrl = memberImageUrls[index];
  }

  res.send(project);
};

exports.getDocFormsByProject = async (req, res, next) => {
  const { project_id } = req.params;

  const forms = await Form.find({ belongsToProject: project_id })
    .sort({
      updatedAt: 1,
    })
    .lean();

  if (!forms) return res.status(404).send({ result: "failure" });

  res.send(forms);
};

exports.createTask = async (req, res, next) => {
  const { project_id } = req.params;
  const taskData = req.body;

  const project = await Project.findById(project_id);

  if (!project) return res.status(409).send({ result: "failure" });

  const newTask = new Task(taskData);

  project.tasks.push(newTask);

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  await newTask.save({ session: mongoSession });
  await project.save({ session: mongoSession });

  await mongoSession.commitTransaction();
  mongoSession.endSession();

  return res.send({ result: "success" });
};

exports.updateTask = async (req, res, next) => {
  const { task_id } = req.params;
  const { title, description, status, endDate, assignees } = req.body;

  const task = await Task.findById(task_id);

  if (!task) return res.status(409).send({ result: "failure" });

  task.title = title;
  task.description = description;
  task.status = status;
  task.endDate = endDate;
  task.assignees = assignees;

  await task.save();

  return res.send({ result: "success" });
};
