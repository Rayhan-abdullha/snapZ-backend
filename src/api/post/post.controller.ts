import { Request, Response, NextFunction } from "express";
import postService from "./post.services";
import BaseController from "../../lib/BaseController";

class PostController extends BaseController {
  createPost = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    try {
      const userId = (req as any).user.id
      const role = (req as any).user.role
      
      this.sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Post created successfully",
        data: await postService.createPost(userId, role, req.body)
      });
    } catch (error) { next(error); }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post deleted",
        data: await postService.deletePost(id)
      });
    } catch (error) { next(error); }
  }
  getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Feed retrieved",
        data: await postService.getAllPosts()
      });
    } catch (error) { next(error); }
  };
    getFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Feed retrieved",
        data: await postService.getAllPosts()
      });
    } catch (error) { next(error); }
  };
  getSingleArticle = async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug
    if (!slug) {
      return this.sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Id is required",
        data: null
      });
    }
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post retrieved",
        data: await postService.getSingleArticle(slug)
      });
    } catch (error) { next(error); }
  }
}

export default new PostController();