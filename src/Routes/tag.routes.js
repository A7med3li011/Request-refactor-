import express from "express";
import { createTag, getTag, updateTag } from "../controllers/tag.controller.js";
import { validate } from "../middleware/validation/execution.js";
import { createTagSchema } from "../middleware/validation/schema.js";
import { auth } from "../middleware/auth/auth.js";

const tagRoutes = express.Router();

tagRoutes.post(
  "/",
  auth(["owner", "contractor", "consultant"]),
  validate(createTagSchema),
  createTag
);
tagRoutes.put(
  "/",
  auth(["owner", "contractor", "consultant"]),
  validate(createTagSchema),
  updateTag
);
tagRoutes.get("/", auth(["owner", "contractor", "consultant"]), getTag);
export default tagRoutes;
