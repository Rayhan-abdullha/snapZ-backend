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
router.get("/user/me", middleware.authenticate, authController.getUserProfile);
// router.post("/refresh-token", authController.refreshToken);
// router.post("/logout", authController.logout);

export default router;
