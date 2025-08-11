import mongoose, { Model, Schema } from "mongoose";

const tagSchema = new Schema({
  title: {
    type: String,
  },
  color: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const tagModel = mongoose.model("Tag", tagSchema);
export default tagModel;
