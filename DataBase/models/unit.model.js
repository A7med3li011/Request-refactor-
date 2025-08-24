import mongoose, { Model, Schema } from "mongoose";

const unitSchema = new Schema(
  {
    title: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const unitModel = mongoose.model("Unit", unitSchema);
export default unitModel;
