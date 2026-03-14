import { Request, Response, NextFunction } from "express";
import conversationService from "./conversation.services";
import BaseController from "../../lib/BaseController";

class ConversationController extends BaseController {
  createConversation = async (req: any, res: Response, next: NextFunction) => {
    try {

      const userId = req.user.id;
      const { receiverId } = req.body;

      const result = await conversationService.createConversation(
        userId,
        receiverId
      );

      this.sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Conversation created",
        data: result
      });

    } catch (error) {
      console.log(error)
      next(error);
    }
  };

  getMyConversations = async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await conversationService.getUserConversations(userId);
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Conversations fetched",
        data: result
      });

    } catch (error) {
      next(error);
    }
  };

  sendMessage = async (req: any, res: Response, next: NextFunction) => {
    try {

      const senderId = req.user.id;
      const { conversationId, receiverId, text } = req.body;

      const result = await conversationService.sendMessage({
        conversationId,
        senderId,
        receiverId,
        text
      });

      this.sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Message sent",
        data: result
      });

    } catch (error) {
      next(error);
    }
  };

  getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const result = await conversationService.getMessages(conversationId);
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Messages fetched",
        data: result
      });

    } catch (error) {
      next(error);
    }
  };

  markSeen = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const result = await conversationService.markSeen(conversationId);
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Message marked as seen",
        data: result
      });

    } catch (error) {
      next(error);
    }
  };

}

export default new ConversationController();