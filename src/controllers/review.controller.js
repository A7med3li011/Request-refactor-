import reviewModel from "../../DataBase/models/review.model.js";
import userModel from "../../DataBase/models/userModel.js";
import getMessage from "../locales/translator.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createReview = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const data = req.body;

  const userExist = await userModel.findById(req.user._id);

  if (!userExist) {
    return next(new AppError(getMessage(lang, "user_notfound"), 404));
  }

  const reviewExist = await reviewModel.findOne({
    createdBy: req.user._id,
    message: data.message,
    rate: data.rate,
  });

  if (reviewExist) {
    return next(new AppError(getMessage(lang, "review_exist"), 409));
  }
  const review = await reviewModel.create({
    ...data,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: getMessage(lang, "review_created"),
  });
});
export const getReview = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const reviews = await reviewModel
    .find({ activation: true })
    .populate("createdBy", "name profileImage");

  res.status(200).json({
    success: true,
    message: getMessage(lang, "review_found"),
    data: reviews,
  });
});
