import express from "express";
import { createPostSchema } from "./post.schema";
import { middleware } from "../../middleware"; // Assuming this has verifyAuth
import postController from "./post.controller";

const router = express.Router();

// admin
router.get("/all-posts", middleware.authenticate, middleware.authorization(["ADMIN"]), postController.getAllPost);
router.get("/feed", postController.getFeed);
// user uploaded post and video
router.get("/user-posts/:userId", postController.getMyPost);

// Protected Actions
router.post(
  "/create",
  middleware.authenticate,
  middleware.validateRequest(createPostSchema),
  postController.createPost
);
router.get("/articles/:slug", postController.getSingleArticle);

// admin
router.delete("/:id", middleware.authenticate, middleware.authorization(["ADMIN"]), postController.deletePost);


export default router;