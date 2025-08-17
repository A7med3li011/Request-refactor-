import express from "express";
import { createReview, getReview } from "../controllers/review.controller.js";
import { auth } from "../middleware/auth/auth.js";
import { validate } from "../middleware/validation/execution.js";
import { createReviewsSchema } from "../middleware/validation/schema.js";

const reviewRoutes = express.Router();
reviewRoutes.post(
  "/",
  auth(["consultant", "owner", "contractor", "user"], "read"),
  validate(createReviewsSchema),
  createReview
);
reviewRoutes.get("/", getReview);

export default reviewRoutes;
