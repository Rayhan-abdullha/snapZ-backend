import express from "express";
import {registerSchema, loginSchema} from "./auth.schema";
import { middleware } from "../../middleware";
import authController from "./auth.controller";

const router = express.Router();

router.post(
    "/register",
    middleware.validateRequest(registerSchema),
  authController.register
);
router.post(
    "/login",
  middleware.validateRequest(loginSchema),
  authController.login
);
router.get("/users/me", middleware.authenticate, authController.getUserProfile);
router.get("/users", authController.getAllUers);
router.delete("/users/:id", middleware.authenticate, middleware.authorization(["ADMIN"]), authController.deleteUser);
router.patch("/add-admin", authController.addAdmin);
export default router;
