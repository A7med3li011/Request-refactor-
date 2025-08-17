import userModel from "../../DataBase/models/userModel.js";
import getMessage from "../locales/translator.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";
import bcrypt from "bcrypt";
export const createTeamMember = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const { name, email, password, phone, vocation, rights } = req.body;

  const userExist = await userModel.findOne({ email: email.toLowerCase() });

  if (userExist) return next(new AppError(getMessage(lang, "EMAILEXIST"), 409));

  const hashedPassword = await bcrypt.hash(password, +process.env.SLAT);

  const newUser = await userModel.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,

    rights,
  });
});
