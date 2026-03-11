import { Request, Response, NextFunction } from "express";
import postService from "./post.services";
import BaseController from "../../lib/BaseController";
import { type } from "os";

class PostController extends BaseController {
  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id
      const role = (req as any).user.role
      
      this.sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Post created successfully",
        data: await postService.createPost(userId, role, req.body)
      });
    } catch (error) {
      next(error);
    }
  };
  getMyPost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Feed retrieved",
        data: await postService.getMyPosts(id)
      });
    } catch (error) { next(error); }
  }
  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const param = req.params.id;
    const query = req.query
    if (!query) {
      next("query is required!")
    }
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Video Reel deleted",
        data: await postService.deletePost(param, query?.type as string)
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
        data: await postService.getFeed()
      });
    } catch (error) {
      next(error);
    }
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
  addBookmarks = async (req: Request, res: Response, next: NextFunction) => {
    const {postId, type} = req.body
    const id = (req as any).user.id
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post bookmarked",
        data: await postService.addBookmarks(id, postId, type)
      });
    } catch (error) {
      next(error);
    }
  }
  getBookmarks = async (req: Request, res: Response, next: NextFunction) => {
    const { postId, type } = req.body
    const userId = (req as any).user.id
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookmarks retrieved",
        data: await postService.getBookmarks(userId)
      });
    } catch (error) { next(error); }
  }
  removeBookmar = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId
    const userId = (req as any).user.id
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Post bookmarked",
        data: await postService.removeBookmark(userId, postId, req.body.type)
      });
    } catch (error) { next(error); }
  }
}

export default new PostController();