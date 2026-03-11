import express from "express";
import { createCourseSchema, enrollSchema } from "./course.schema";
import { middleware } from "../../middleware";
import courseController from "./course.controller";

const router = express.Router();
router.get(
  "/",
  courseController.getAllCourses
);

// myEnroll courses
router.get(
  "/my-enrollments",
  middleware.authenticate,
  courseController.myEnrollments
)
// get single course
router.get(
  "/:id",
  middleware.authenticate,
  courseController.getSingleCourse
);

// ৩. কোর্স এনরোলমেন্ট (ইউজারের জন্য)
router.post(
  "/enroll",
  middleware.authenticate,
  middleware.validateRequest(enrollSchema),
  courseController.enroll
);


// ১. নতুন কোর্স তৈরি (Initial)
router.post(
  "/create",
  middleware.authenticate,
  middleware.authorization(["ADMIN"]),
  middleware.validateRequest(createCourseSchema),
  courseController.createCourse
);

// ২. কোর্সের কন্টেন্ট (Section/Lesson) আপডেট বা এডিট
router.put(
  "/update-content/:courseId",
  middleware.authenticate,
  middleware.authorization(["ADMIN"]),
  courseController.updateContent
);

// delete course
router.delete(
  "/:id",
  middleware.authenticate,
  middleware.authorization(["ADMIN"]),
  courseController.deleteCourse
);

export default router;