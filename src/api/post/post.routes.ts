import express from "express";
import { createPostSchema } from "./post.schema";
import { middleware } from "../../middleware"; // Assuming this has verifyAuth
import postController from "./post.controller";

const router = express.Router();

// Public Feed
router.get("/feed", postController.getFeed);

// Protected Actions
router.post(
  "/create",
  middleware.authenticate,
  middleware.validateRequest(createPostSchema),
  postController.createPost
);
router.get("/articles/:slug", postController.getSingleArticle);

export default router;