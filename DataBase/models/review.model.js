import mongoose, { Model, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    message: {
      type: String,
    },
    rate: {
      type: Number,
    },

    activation: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
