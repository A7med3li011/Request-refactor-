import { customAlphabet } from "nanoid";
import userModel from "../../DataBase/models/userModel.js";
import getMessage from "../locales/translator.js";
import { AppError } from "../utilities/AppError.js";
import { handlerAsync } from "../utilities/handleAsync.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/nodemailer/sendEmail.js";
import { randomNumber } from "../utilities/randomNumber.js";
import jwt from "jsonwebtoken";
import { avoidResendSpam } from "../utilities/avoidspam.js";
import { deleteFile } from "../utilities/deleteFile.js";
/////////////////////// register ///////////////////////////
export const signup = handlerAsync(async (req, res, next) => {
  const { role, name, email, phone, password } = req.body;
  const lang = req.query.lang || "en";

  const [emailExist, phoneExits] = await Promise.all([
    userModel.findOne({ email }),
    userModel.findOne({ phone }),
  ]);

  if (emailExist)
    return next(new AppError(getMessage(lang, "EMAILEXIST"), 409));

  if (phoneExits)
    return next(new AppError(getMessage(lang, "PhoneExist"), 409));

  const hashedPassword = await bcrypt.hash(password, +process.env.SLAT);

  const code = randomNumber(4);
  const user = await userModel.create({
    name,
    role,
    phone,
    password: hashedPassword,
    email,
    verificationCode: code,
  });
  if (user) {
    await sendEmail(email, `your verification code is : ${code}`);
  }

  res.status(201).json({
    success: true,
    message: getMessage(lang, "CREATEUSER"),
  });
});

/////////////////////// verifiedEmail ///////////////////////////
export const verifiedEmail = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { email, otp } = req.body;

  const userExist = await userModel.findOne({ email });

  if (!userExist)
    return next(new AppError(getMessage(lang, "Regitser_first"), 404));

  if (userExist.verifiedRegister)
    return next(new AppError(getMessage(lang, "already_verified_email"), 409));

  if (userExist.verificationCode.toString() === otp.toString()) {
    userExist.verifiedRegister = true;
    userExist.verificationCode = randomNumber(4);
    await userExist.save();

    res.status(200).json({
      success: true,
      message: getMessage(lang, "verified_success"),
    });
  } else {
    return next(new AppError(getMessage(lang, "invalid_otp"), 409));
  }
});

/////////////////////// login ///////////////////////////
export const login = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { email, password } = req.body;

  const userExist = await userModel.findOne({ email });

  if (!userExist)
    return next(new AppError(getMessage(lang, "Regitser_first"), 404));
  if (!userExist.verifiedRegister)
    return next(new AppError(getMessage(lang, "verify_first"), 401));

  const isMatch = await bcrypt.compare(password, userExist.password);

  if (!isMatch)
    return next(new AppError(getMessage(lang, "credentials_error"), 401));

  await sendEmail(
    email,
    `your verification code is: ${userExist.verificationCode}`
  );

  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "success_login") });
});
/////////////////////// login OTP ///////////////////////////

export const loginOtp = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { email, otp } = req.body;
  const userExist = await userModel.findOne({ email });

  if (!userExist)
    return next(new AppError(getMessage(lang, "Regitser_first"), 404));

  if (userExist.verificationCode.toString() === otp.toString()) {
    userExist.verifiedlogin = true;
    userExist.verificationCode = randomNumber(4);
    userExist.lastlogin = new Date();
    await userExist.save();

    const userData = {
      _id: userExist._id,
      name: userExist.name,
      role: userExist.role,
      phone: userExist.phone,
      rights: userExist.rights || [],
    };
    const token = jwt.sign(userData, process.env.SECRETEKEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: getMessage(lang, "verified_login_success"),
    });
  } else {
    return next(new AppError(getMessage(lang, "invalid_otp"), 400));
  }
});

/////////////////////// resendOtp ///////////////////////////
export const reSendOtp = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { email } = req.body;
  const userExist = await userModel.findOne({ email });
  if (!userExist)
    return next(new AppError(getMessage(lang, "Regitser_first"), 404));

  const checkSpam = avoidResendSpam(userExist);

  if (checkSpam)
    return next(new AppError(getMessage(lang, "otp_cooldown"), 429));

  const RN = randomNumber(4);
  userExist.verificationCode = RN;
  userExist.lastOtpSentAt = new Date();
  await userExist.save();
  await sendEmail(email, `your verification code is: ${RN}`);

  res.status(200).json({
    success: true,
    message: getMessage(lang, "resend_otp"),
  });
});

/////////////////////// check email exist ///////////////////////////
export const checkAccount = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const email = req.body.email.toLowerCase().trim();

  const emailExist = await userModel.findOne({ email });

  if (!emailExist)
    return next(new AppError(getMessage(lang, "Regitser_first"), 404));

  const code = randomNumber(4);
  await sendEmail(email, `your verification code is: ${code}`);
  emailExist.verificationCode = code;
  await emailExist.save();

  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "email_checked") });
});

/////////////////////// reset password ///////////////////////////

export const reset = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { otp, password, email } = req.body;

  const userExist = await userModel.findOne({
    email: email.toLowerCase().trim(),
  });
  if (!userExist)
    return next(new AppError(getMessage(lang, "Regitser_first"), 404));

  if (userExist.verificationCode.toString() !== otp.toString())
    return next(new AppError(getMessage(lang, "invalid_otp"), 400));

  const hashedPassword = await bcrypt.hash(password, +process.env.SLAT);

  userExist.password = hashedPassword;
  const code = randomNumber(4);
  userExist.verificationCode = code;
  await userExist.save();
  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "password_changed") });
});
export const updateProfile = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;

  const userExits = await userModel.findById(req.user._id);

  if (!userExits)
    return next(new AppError(getMessage(lang, "user_notfound"), 404));

  const data = req.body;

  let query = {};

  if (req.file) {
    if (userExits.profileImage) {
      deleteFile("profile-pic", userExits.profileImage);
    }
    query = { ...data, profileImage: req.file.filename };
  } else {
    query = { ...data };
  }

  const updatedUser = await userModel.findByIdAndUpdate(req.user._id, query);

  res
    .status(200)
    .json({ success: true, message: getMessage(lang, "user_updated") });
});

export const updateCompany = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  const { CompanyName } = req.body;

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new AppError(getMessage(lang, "user_notfound"), 404));
  }

  const fileFields = ["companyLogo", "signature", "electronicStamp"];
  const data = { CompanyName };

  for (const field of fileFields) {
    if (req.files?.[field]?.[0]) {
      if (user[field]) {
        await deleteFile("company", user[field]);
      }
      data[field] = req.files[field][0].filename;
    }
  }

  const updatedCompany = await userModel.findByIdAndUpdate(user._id, data);

  res.status(200).json({
    success: true,
    message: getMessage(lang, "company_updated"),
  });
});
