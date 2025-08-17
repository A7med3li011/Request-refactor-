import mongoose, { Model, Schema } from "mongoose";

const teamSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    memebers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        vocation: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vocation",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const teamModel = mongoose.model("Team", teamSchema);
export default teamModel;
