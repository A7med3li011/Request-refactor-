import express from "express";
import { createTicktet } from "../controllers/ticket.controller.js";
import { validate } from "../middleware/validation/execution.js";
import { createTicketSchema } from "../middleware/validation/schema.js";
import { multer4server } from "../services/multer.js";

const ticketRoutes = express.Router();

ticketRoutes.post(
  "/",
  multer4server("ticket").single("image"),
  validate(createTicketSchema),
  createTicktet
);

export default ticketRoutes;
