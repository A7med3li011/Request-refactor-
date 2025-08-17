import mongoose, { Model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    verificationCode: {
      type: String,
    },
    lastlogin: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    CompanyName: {
      type: String,
    },
    signature: {
      type: String,
    },
    electronicStamp: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "contractor", "consultant", "owner", "user"],
    },

    notifications: {
      type: Boolean,
      default: true,
    },
    verifiedRegister: {
      type: Boolean,
      default: false,
    },
    verifiedlogin: {
      type: Boolean,
      default: false,
    },

    birthOfDate: {
      type: Date,
    },
    lastOtpSentAt: {
      type: Date,
    },
    rights: [String],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
