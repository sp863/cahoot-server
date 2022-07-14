const Form = require("../../models/Form");
const Project = require("../../models/Project");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileUrl, getFile } = require("../../aws/s3");
const { default: mongoose } = require("mongoose");
const User = require("../../models/User");
const { signPDF } = require("../../digitalSignature/signPDF.js");

exports.uploadNewForm = async (req, res, next) => {
  const formFiles = req.files;
  const { project_id, title, requiredSignatures } = req.body;
  const formImageKeys = formFiles
    .map((formImage) => formImage.filename)
    .slice(0, formFiles.length - 1);
  const newForm = new Form({
    title,
    belongsToProject: project_id,
    pdfFileKey: formFiles.slice().pop().filename,
    formImageKeys,
    requiredSignatures,
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

  const form = await Form.findById(form_id).lean();

  if (!form) return res.status(404).send({ result: "failure" });

  const imageUrls = [];

  for (const key of form.formImageKeys) {
    const file = await getFile(key);

    const base64String = file.Body.toString("base64");

    imageUrls.push("data:image/jpeg;base64," + base64String);
  }

  form.imageUrls = imageUrls;

  res.send(form);
};

exports.signDocForm = async (req, res, next) => {
  const { form_id } = req.params;
  const { inputData, user_id } = req.body;

  const form = await Form.findById(form_id);
  const user = await User.findById(user_id).lean();

  if (!form) return res.status(404).send({ result: "failure" });
  if (!user) return res.status(404).send({ result: "failure" });

  const pdfFile = await getFile(form.pdfFileKey);

  const base64Images = await signPDF(pdfFile, inputData);
  await uploadFile({ path: "signed.pdf", filename: form.pdfFileKey });
  await unlinkFile("signed.pdf");

  for (const [index] of base64Images.entries()) {
    await unlinkFile(`signed-page-${index + 1}.pdf`);
  }

  form.signed.push(user.email);

  await form.save();

  return res.send(base64Images);
};

exports.uploadFormImages = async (req, res, next) => {
  const formFiles = req.files;
  const { form_id } = req.params;
  const form = await Form.findById(form_id);

  if (!form) return res.status(404).send({ result: "failure" });

  for (const [index, file] of formFiles.entries()) {
    await uploadFile(file);

    form.formImageKeys[index] = file.filename;

    await unlinkFile(file.path);
  }

  await form.save();

  return res.send({ result: "success" });
};
