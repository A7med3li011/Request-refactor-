import express from "express";
import { auth } from "../middleware/auth/auth.js";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
} from "../controllers/team.controller.js";
import { validate } from "../middleware/validation/execution.js";
import { createTeamScehama } from "../middleware/validation/schema.js";

const teamRoutes = express.Router();

teamRoutes.post(
  "/",
  validate(createTeamScehama),
  auth(["owner", "contractor", "consultant"]),
  createTeamMember
);
teamRoutes.get(
  "/",

  auth(["owner", "contractor", "consultant"]),
  getTeamMembers
);
teamRoutes.delete(
  "/:id",

  auth(["owner", "contractor", "consultant"]),
  deleteTeamMember
);

export default teamRoutes;
