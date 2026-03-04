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
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logout successful",
        data: await authService.logout(refreshToken)
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();