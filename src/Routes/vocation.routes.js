import express from "express";
import {
  createVocation,
  deleteVocation,
  getVocation,
  updateVocation,
} from "../controllers/vocation.controller.js";
import { auth } from "../middleware/auth/auth.js";
import { validate } from "../middleware/validation/execution.js";
import { createVocationSchema } from "../middleware/validation/schema.js";

const voacationRoutes = express.Router();

voacationRoutes.post(
  "/",
  auth(["owner", "contractor", "consultant"]),
  validate(createVocationSchema),
  createVocation
);
voacationRoutes.get(
  "/",
  auth(["owner", "contractor", "consultant"]),
  getVocation
);
voacationRoutes.put(
  "/:id",
  auth(["owner", "contractor", "consultant"]),
  validate(createVocationSchema),
  updateVocation
);
voacationRoutes.delete(
  "/:id",
  auth(["owner", "contractor", "consultant"]),
  deleteVocation
);

export default voacationRoutes;
