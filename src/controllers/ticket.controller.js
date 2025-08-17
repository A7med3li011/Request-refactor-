import ticketModel from "../../DataBase/models/ticket.model.js";
import userModel from "../../DataBase/models/userModel.js";
import getMessage from "../locales/translator.js";
import { handlerAsync } from "../utilities/handleAsync.js";

export const createTicktet = handlerAsync(async (req, res, next) => {
  const lang = req.query.lang;
  let data = req.body;
  const userExist = await userModel.findOne({
    email: data.email.toLowerCase(),
  });

  if (userExist) {
    data.createdBy = userExist._id;
  }

  if (req.file) {
    data.image = req.file.filename;
  }

  await ticketModel.create(data);

  res
    .status(201)
    .json({ success: true, message: getMessage(lang, "ticket_created") });
});
