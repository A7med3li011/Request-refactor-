import mongoose, { Model, Schema } from "mongoose";

const ticketSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  image: {
    type: String,
    default: null,
  },
  response: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, {
    timestamps: true,
  });

const ticketModel = mongoose.model("Ticket", ticketSchema);
export default ticketModel;
