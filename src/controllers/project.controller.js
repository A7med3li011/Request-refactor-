import projectModel from "../../DataBase/models/project.model.js";
import userModel from "../../DataBase/models/userModel.js";
import getMessage from "../locales/translator.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createProject = handlerAsync(async (req, res) => {
  const lang = req.query.lang;
  const {
    title,
    description,
    startDate,
    endDate,
    budget,
    location,
    priority,
    role,
  } = req.body;

  const userExist = await userModel.findById(req.user._id);
  if (!userExist)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const projectData = {
    title,
    description,
    startDate,
    endDate,
    budget,
    location,
    priority,
    createdBy: req.user._id,
    members: [req.user._id],
  };

  switch (role) {
    case "owner":
      projectData.owner = req.user._id;
      break;
    case "contractor":
      projectData.contractor = req.user._id;
      break;
    case "consultant":
      projectData.consultant = req.user._id;
      break;
  }

  const newProject = await projectModel.create(projectData);

  res.status(201).json({
    success: true,
    message: getMessage(lang, "project_created"),
  });
});
export const getPojects = handlerAsync(async (req, res) => {
  const lang = req.query.lang;

  const userExist = await userModel.findById(req.user._id);
  if (!userExist)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const projects = await projectModel
    .find({
      $or: [
        { owner: req.user._id },
        { contractor: req.user._id },
        { consultant: req.user._id },
      ],
    })
    .populate("owner contractor consultant createdBy", "profileImage");

  res.status(200).json({
    success: true,
    message: getMessage(lang, "project_found"),
    data: projects,
  });
});
export const getPojectDetails = handlerAsync(async (req, res) => {
  const lang = req.query.lang;

  const { id } = req.params;
  const userExist = await userModel.findById(req.user._id);
  if (!userExist)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const projectExist = await projectModel
    .findById(id)
    .populate(
      "owner contractor consultant createdBy",
      "name email role  profileImage"
    );

  if (!projectExist)
    return next(new AppError(getMessage(lang, "project_notFound"), 404));

  res.status(200).json({
    success: true,
    message: getMessage(lang, "project_found"),
    data: projectExist,
  });
});

export const deleteProject = handlerAsync(async (req, res) => {
  const lang = req.query.lang;
  const { id } = req.params;

  const projectExist = await projectModel.findById(id);

  if (!projectExist)
    return next(new AppError(getMessage(lang, "project_notFound"), 404));

  // if (projectExist.createdBy.toString() !== req.user._id.toString())
  //   return next(new AppError(getMessage(lang, "forbidden"), 403));

  await projectModel.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: getMessage(lang, "project_deleted"),
  });
});
export const updateProject = handlerAsync(async (req, res) => {
  const lang = req.query.lang;
  const { id } = req.params;
  const data = req.body;

  const projectExist = await projectModel.findById(id);

  if (!projectExist)
    return next(new AppError(getMessage(lang, "project_notFound"), 404));

  // if (projectExist.createdBy.toString() !== req.user._id.toString())
  //   return next(new AppError(getMessage(lang, "forbidden"), 403));

  await projectModel.findByIdAndUpdate(id, data);
  res.status(200).json({
    success: true,
    message: getMessage(lang, "project_updated"),
  });
});
