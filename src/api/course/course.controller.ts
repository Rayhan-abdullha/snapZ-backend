import { Request, Response, NextFunction } from "express";
import courseService from "./course.services";
import BaseController from "../../lib/BaseController";

class CourseController extends BaseController {
  createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await courseService.createCourse(req.body);
      this.sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Course created successfully",
        data: result
      });
    } catch (error) { next(error); }
  };

  updateContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const result = await courseService.updateCourseContent(courseId, req.body.sections);
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Course content updated",
        data: result
      });
    } catch (error) { next(error); }
  };

  enroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id; // Middleware থেকে পাওয়া ইউজার আইডি
      const result = await courseService.enrollInCourse(userId, req.body.courseId);
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Enrolled successfully",
        data: result
      });
    } catch (error) { next(error); }
  };
  getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await courseService.getAllCourses();
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All Courses",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
  getSingleCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await courseService.getSingleCourse(req.params.id);
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Single Course",
        data: result
      });
    } catch (error) {
      console.log(error)
      next(error);
    }
  };
  myEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id; // Middleware থেকে পাওয়া ইউজার আইডি
      const result = await courseService.myEnrollments(userId);
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "My Enrollment courses",
        data: result
      });
    } catch (error) { next(error); }
  }
  deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await courseService.deleteCourse(req.params.id);
      this.sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Course deleted",
        data: result
      });
    } catch (error) { next(error); }
  };
}

export default new CourseController();