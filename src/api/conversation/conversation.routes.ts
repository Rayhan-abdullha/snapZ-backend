import express from "express";
import conversationController from "./conversation.controller";
import { middleware } from "../../middleware";
import {
  createConversationSchema,
  sendMessageSchema
} from "./conversation.schema";

const router = express.Router();

router.post(
  "/",
  middleware.authenticate,
  middleware.validateRequest(createConversationSchema),
  conversationController.createConversation
);

router.get(
  "/",
  middleware.authenticate,
  conversationController.getMyConversations
);

router.post(
  "/message",
  middleware.authenticate,
  middleware.validateRequest(sendMessageSchema),
  conversationController.sendMessage
);

router.get(
  "/messages/:conversationId",
  middleware.authenticate,
  conversationController.getMessages
);

router.patch(
  "/seen/:conversationId",
  middleware.authenticate,
  conversationController.markSeen
);

export default router;