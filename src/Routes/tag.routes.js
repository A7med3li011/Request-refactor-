import express from "express";
import {
  createTag,
  deleteTag,
  getTag,
  updateTag,
  getTagByUserId,
} from "../controllers/tag.controller.js";
import { validate } from "../middleware/validation/execution.js";
import {
  createTagSchema,
  updateTagSchema,
} from "../middleware/validation/schema.js";
import { auth } from "../middleware/auth/auth.js";

const tagRoutes = express.Router();

tagRoutes.post(
  "/",
  auth(["owner", "contractor", "consultant"]),
  validate(createTagSchema),
  createTag
);


tagRoutes.put(
  "/:id",
  auth(["owner", "contractor", "consultant"]),
  validate(updateTagSchema),
  updateTag
);


tagRoutes.delete(
  "/:id",
  auth(["owner", "contractor", "consultant"]),
  deleteTag
);

tagRoutes.get("/", auth(["owner", "contractor", "consultant"]), getTag);


tagRoutes.get(
  "/:id",
  auth(["owner", "contractor", "consultant"]),
  getTagByUserId
);


export default tagRoutes;
