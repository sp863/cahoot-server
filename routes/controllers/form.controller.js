const Form = require("../../models/Form");
const Project = require("../../models/Project");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileUrl } = require("../../aws/s3");
const { default: mongoose } = require("mongoose");

exports.uploadNewForm = async (req, res, next) => {
  const formFiles = req.files;
  const { project_id, title } = req.body;

  const formImageKeys = formFiles
    .map((formImage) => formImage.filename)
    .slice(0, formFiles.length - 1);

  const newForm = new Form({
    title,
    belongsToProject: project_id,
    formKey: formFiles.pop().filename,
    formImageKeys,
  });

  const project = await Project.findById(project_id);

  project.forms.push(newForm);
  for (const file of formFiles) {
    await uploadFile(file);
    await unlinkFile(file.path);
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  await newForm.save({ session: mongoSession });
  await project.save({ session: mongoSession });

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

  for (const form of forms) {
    const urls = [];
    for (const key of form.formImageKeys) {
      const imageUrl = await getFileUrl(key);
      urls.push(imageUrl);
    }
    form.imageUrls = urls;
  }

  res.send(forms);
};

exports.getDocForm = async (req, res, next) => {
  const { form_id } = req.params;

  console.log("FORM ID", form_id);
};
