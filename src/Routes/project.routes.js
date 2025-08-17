import express from "express";
import { auth } from "../middleware/auth/auth.js";
import { validate } from "../middleware/validation/execution.js";
import { createProjectSchema } from "../middleware/validation/schema.js";
import {
  createProject,
  getPojects,
  deleteProject,
  updateProject,
  getPojectDetails,
} from "../controllers/project.controller.js";

const projectRoutes = express.Router();

projectRoutes.post(
  "/",
  auth(["owner", "contractor", "consultant"]),
  validate(createProjectSchema),
  createProject
);
projectRoutes.put(
  "/:id",
  auth(["owner", "contractor", "consultant", "user"], "update"),
  validate(createProjectSchema),
  updateProject
);

projectRoutes.get(
  "/",
  auth(["owner", "contractor", "consultant", "user"], "read"),
  getPojects
);
projectRoutes.get(
  "/:id",
  auth(["owner", "contractor", "consultant", "user"], "read"),
  getPojectDetails
);
projectRoutes.delete(
  "/:id",
  auth(["owner", "contractor", "consultant", "user"], "delete"),
  deleteProject
);

export default projectRoutes;
