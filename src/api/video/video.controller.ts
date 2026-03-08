import { Request, Response, NextFunction } from "express";
import contentService from "./video.services";
import BaseController from "../../lib/BaseController";

class ContentController extends BaseController {
  createVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      this.sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Video Reel published",
        data: await contentService.createVideo(userId, req.body)
      });
    } catch (error) { next(error); }
  };
  addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      this.sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Comment added",
        data: await contentService.createComment(userId, req.body)
      });
    } catch (error) { next(error); }
  };
  getPostComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Comments retrieved",
        data: await contentService.getPostComments(req.params.id, req.query.type as string)
      });
    } catch (error) { next(error); }
  }
  toggleLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Reaction updated",
        data: await contentService.toggleLike(userId, req.body)
      });
    } catch (error) { next(error); }
  };
}

export default new ContentController();