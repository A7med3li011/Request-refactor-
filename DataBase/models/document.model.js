import mongoose, { Model, Schema } from "mongoose";

const docSceham = new Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DocumentModel = mongoose.model("Document", docSceham);
export default DocumentModel;
