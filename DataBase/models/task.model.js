import mongoose, { Model, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    unite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },
    type: {
      type: String,
      enum: ["toq", "milestone", "recurring", "oneTime"],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    priority: {
      type: String,
    },
    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    total: {
      type: Number,
    },
    invoiced: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Number,
      default: 0,
    },
    executed: {
      type: Number,
      default: 0,
    },
    notes: [
      {
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: { type: String },
        createdAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const taskModel = mongoose.model("Task", taskSchema);
export default taskModel;
