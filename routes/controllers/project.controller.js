const Project = require("../../models/Project");
const Form = require("../../models/Form");
const User = require("../../models/User");
const { default: mongoose } = require("mongoose");

exports.createProject = async (req, res, next) => {
  const { name, user_id } = req.body;

  const project = await Project.findOne({ name });

  if (project) return res.status(409).send({ result: "failure" });

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
