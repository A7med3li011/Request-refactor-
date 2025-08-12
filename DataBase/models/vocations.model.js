import mongoose, { Schema } from "mongoose";

const vocationSchema = new Schema({
  title: {
    type: String,
  },
  title_ar: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const vocationModel = mongoose.model("Vocation", vocationSchema);
export default vocationModel;
