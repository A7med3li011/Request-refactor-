import express from "express";
import {
  addNote,
  createTask,
  deleteFilebyId,
  deleteTaskbyId,
  getTaskbyId,
  UpdateexecutionTask,
  updateTaskbyId,
  uploadFiles,
} from "../controllers/task.controller.js";
import { auth } from "../middleware/auth/auth.js";
import { access } from "../middleware/auth/access.js";
import { validate } from "../middleware/validation/execution.js";
import {
  addNoteTaskSchema,
  createTaskSchema,
  executionTaskSchema,
  uploadTaskfile,
} from "../middleware/validation/schema.js";
import { multer4files } from "../services/multer4files.js";

const taskRoutes = express.Router();

taskRoutes.post(
  "/",
  auth(["owner", "consultant", "contractor", "user"]),
  access("create"),
  validate(createTaskSchema),
  createTask
);
taskRoutes.post(
  "/upload",
  multer4files("tasks").single("doc"),
  auth(["owner", "consultant", "contractor", "user"]),
  access("create"),
  validate(uploadTaskfile),
  uploadFiles
);
taskRoutes.post(
  "/note",

  auth(["owner", "consultant", "contractor", "user"]),
  access("read"),
  validate(addNoteTaskSchema),
  addNote
);
taskRoutes.get(
  "/",
  auth(["owner", "consultant", "contractor", "user"]),
  access("read"),

  createTask
);
taskRoutes.get(
  "/:id",
  auth(["owner", "consultant", "contractor", "user"]),
  access("read"),
  getTaskbyId
);
taskRoutes.delete(
  "/:fileId/:taskId",
  auth(["owner", "consultant", "contractor", "user"]),
  access("delete"),
  deleteFilebyId
);
taskRoutes.delete(
  "/:id",
  auth(["owner", "consultant", "contractor", "user"]),
  access("delete"),
  deleteTaskbyId
);
taskRoutes.put(
  "/execution/:id",
  auth(["owner", "consultant", "contractor"]),

  validate(executionTaskSchema),
  UpdateexecutionTask
);
taskRoutes.put(
  "/:id",
  auth(["owner", "consultant", "contractor", "user"]),
  access("update"),
  validate(createTaskSchema),
  updateTaskbyId
);

export default taskRoutes;
