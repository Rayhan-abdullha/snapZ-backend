import express from "express";
import { createVideoSchema, createCommentSchema, toggleLikeSchema } from "./video.schema";
import { middleware } from "../../middleware";
import contentController from "./video.controller";
const router = express.Router();

// All these routes require a logged-in user
router.use(middleware.authenticate); 

router.post("/video", middleware.validateRequest(createVideoSchema), contentController.createVideo);

router.post("/comments", middleware.validateRequest(createCommentSchema), contentController.addComment);
router.post("/likes", middleware.validateRequest(toggleLikeSchema), contentController.toggleLike);

export default router;