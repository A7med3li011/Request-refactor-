import tagModel from "../../DataBase/models/tags.model.js";
import userModel from "../../DataBase/models/userModel.js";
import getMessage from "../locales/translator.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createTag = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  let { tags } = req.body;
  const userExits = await userModel.findById(req.user._id);

  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  tags = tags.filter((tag, index, self) => {
    return (
      index ===
      self.findIndex(
        (t) => t.title.trim().toLowerCase() === tag.title.trim().toLowerCase()
      )
    );
  });

  let data = [];
  for (const item of tags) {
    const { title, color } = item;
    const tagExist = await tagModel.findOne({
      title,
      createdBy: userExits._id,
    });
    if (tagExist) return next(new AppError(getMessage(lang, "tag_exist"), 409));
    data.push({ ...item, createdBy: userExits._id });
  }

  const createdTag = await tagModel.insertMany(data);
  res
    .status(201)
    .json({ success: true, message: getMessage(lang, "tag_created") });
});

export const updateTag = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { id } = req.params;
  const userExits = await userModel.findById(req.user._id);

  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const { title, color } = req.body;

  const tagExits = await tagModel.findById(id);

  if (!tagExits)
    return next(new AppError(getMessage(lang, "tag_notFound"), 404));

  const conflictTag = await tagModel.findOne({
    _id: { $ne: id },
    title,
    createdBy: userExits._id,
  });
  if (conflictTag)
    return next(new AppError(getMessage(lang, "tag_exist"), 409));

  await tagModel.findByIdAndUpdate(id, { title, color });
  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "tag_updated") });
});

export const getTag = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const userExits = await userModel.findById(req.user._id);

  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const tags = await tagModel.find({ createdBy: userExits._id });
  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "tag_found"), tags });
});
export const getTagByUserId = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { id } = req.params;
  const userExits = await userModel.findById(id);
  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const tags = await tagModel.find({ createdBy: userExits._id });
  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "tag_found"), tags });
});
export const deleteTag = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { id } = req.params;

  const userExits = await userModel.findById(req.user._id);
  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const tagExits = await tagModel.findById(id);

  if (!tagExits)
    return next(new AppError(getMessage(lang, "tag_notFound"), 404));

  await tagModel.findByIdAndDelete(id); 

res.status(200).json({success:true,message:getMessage(lang, "tag_deleted")});

});
