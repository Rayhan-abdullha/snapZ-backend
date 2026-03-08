import express from "express";
import { createVideoSchema, createCommentSchema, toggleLikeSchema } from "./video.schema";
import { middleware } from "../../middleware";
import contentController from "./video.controller";
const router = express.Router();

// All these routes require a logged-in user
router.get("/comments/:id", contentController.getPostComments);
router.use(middleware.authenticate); 

router.post("/video", middleware.validateRequest(createVideoSchema), contentController.createVideo);
router.post("/likes", middleware.validateRequest(toggleLikeSchema), contentController.toggleLike);

router.post("/comments", middleware.validateRequest(createCommentSchema), contentController.addComment);

export default router;