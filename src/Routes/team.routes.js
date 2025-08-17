import express from "express";
import { auth } from "../middleware/auth/auth.js";

const teamRoutes = express.Router();

teamRoutes.post("/",auth(["owner","contractor","consultant"]))

export default teamRoutes;
