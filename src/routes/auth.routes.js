import { Router } from "express";
import { authHealthCheck ,verifyOtpController,sendOtpController } from "../controllers/auth.controller.js";

const router = Router();

// health check route
router.post("/health", authHealthCheck);

// send OTP route
router.post("/send-otp", sendOtpController); // storing in redis 

router.post("/verify-otp", verifyOtpController);

export default router;