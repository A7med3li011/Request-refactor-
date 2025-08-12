import userModel from "../../DataBase/models/userModel.js";
import vocationModel from "../../DataBase/models/vocations.model.js";
import getMessage from "../locales/translator.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createVocation = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const { title, title_ar } = req.body;

  const userExits = await userModel.findById(req.user._id);

  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const vocationExist = await vocationModel.findOne({
    createdBy: req.user._id,
    $or: [
      { title: { $regex: `^${title.trim()}$`, $options: "i" } },
      { title_ar: { $regex: `^${title_ar.trim()}$`, $options: "i" } },
    ],
  });

  if (vocationExist)
    return next(new AppError(getMessage(lang, "vocation_exist"), 409));

  await vocationModel.create({ title, title_ar, createdBy: req.user._id });

  res.status(201).json({
    success: true,
    status: "success",
    message: getMessage(lang, "vocation_created"),
  });
});

export const updateVocation = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { title, title_ar } = req.body;

  const userExits = await userModel.findById(req.user._id);
  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const vocationExist = await vocationModel.findById(req.params.id);
  if (!vocationExist)
    return next(new AppError(getMessage(lang, "vocation_notFound"), 404));

  const vocationConflict = await vocationModel.findOne({
    createdBy: req.user._id,
    _id: { $ne: req.params.id },
    $or: [
      { title: { $regex: `^${title.trim()}$`, $options: "i" } },
      { title_ar: { $regex: `^${title_ar.trim()}$`, $options: "i" } },
    ],
  });

  if (vocationConflict)
    return next(new AppError(getMessage(lang, "vocation_exist"), 409));

  await vocationModel.findByIdAndUpdate(req.params.id, { title, title_ar });

  res.status(200).json({
    success: true,
    message: getMessage(lang, "vocation_updated"),
  });
});

export const getVocation = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const userExits = await userModel.findById(req.user._id);

  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const vocations = await vocationModel.find({ createdBy: req.user._id });

  res.status(200).json({
    success: true,
    status: "success",
    message: getMessage(lang, "vocation_found"),
    data: vocations,
  });
});

export const deleteVocation = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const userExits = await userModel.findById(req.user._id);

  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const vocation = await vocationModel.findByIdAndDelete(req.params.id);

  if (!vocation)
    return next(new AppError(getMessage(lang, "vocation_notFound"), 404));

  res.status(200).json({
    success: true,
    status: "success",
    message: getMessage(lang, "vocation_deleted"),
  });
});
