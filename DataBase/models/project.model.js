import mongoose, { Model, Schema } from "mongoose";

const projectSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  progress: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  budget: {
    type: Number,
  },
  location: {
    type: String,
  },
  priority: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  consultant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{
  timestamps: true,
});

const projectModel = mongoose.model("Project", projectSchema);
export default projectModel;
