import express from "express";
import { validate } from "../middleware/validation/execution.js";
import {
  loginSchema,
  signupSchema,
  verifiedSchema,
  resendOtp,
  resetPasswordSchema,
  updateUserProfileSchema,
  updateUserCompanySchema,
} from "../middleware/validation/schema.js";
import {
  checkAccount,
  login,
  loginOtp,
  reSendOtp,
  reset,
  signup,
  updateCompany,
  updateProfile,
  verifiedEmail,
} from "../controllers/user.controller.js";
import { auth } from "../middleware/auth/auth.js";
import { multer4server } from "../services/multer.js";

const userRoutes = express.Router();
// const upload = multer4server();
userRoutes.post("/signup", validate(signupSchema), signup);
userRoutes.post("/verifiedEmail", validate(verifiedSchema), verifiedEmail);
userRoutes.post("/login", validate(loginSchema), login);
userRoutes.post("/otp", validate(verifiedSchema), loginOtp);
userRoutes.post("/resendotp", validate(resendOtp), reSendOtp);
userRoutes.post("/forgetpassowrd", validate(resendOtp), checkAccount);
userRoutes.post("/resetpassword", validate(resetPasswordSchema), reset);
userRoutes.put(
  "/profileUpdate",
  multer4server("profile-pic").single("image"),
  validate(updateUserProfileSchema),
  auth(["owner", "contractor", "consultant", "user"], "read"),
  updateProfile
);
userRoutes.put(
  "/companyUpdate",
  multer4server("company").fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "electronicStamp", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  validate(updateUserCompanySchema),
  auth(["owner", "contractor", "consultant", "user"], "read"),
  updateCompany
);

export default userRoutes;
