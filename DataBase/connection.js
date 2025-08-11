import mongoose from "mongoose";
//Connet to database - live db
//mongodb://127.0.0.1:27017/law
export default async function connection() {
  await mongoose
    .connect(process.env.DATABASE)
    .then((res) => console.log("connection established"))
    .catch((err) => console.log("connection err"));
}
