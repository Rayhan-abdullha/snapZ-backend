import { Request, Response, NextFunction } from "express";
import authService from "./auth.services";
import BaseController from "../../lib/BaseController";

class AuthController extends BaseController {

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User Registered successfully",
        data: await authService.register(req.body)
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: await authService.login(email, password)
      });
    } catch (error) {
      next(error);
    }
  };
  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User profile retrieved",
        data: await authService.getProfile(userId)
      });
    } catch (error) {
      next(error);
    }
  }
  getAllUers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All Users retrieved",
        data: await authService.getAllUsers()
      });
    } catch (error) {
      next(error);
    }
  }
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User deleted",
        data: await authService.deleteUser(userId)
      });
    } catch (error) {
      next(error);
    }
  }
  addAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    if (!email) {
      return this.sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Please provide email",
        data: null
      });
    }
    try {
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin added",
        data: await authService.addAdmin(email)
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();