import { Router } from "express";
import { authHealthCheck ,verifyOtpController,sendOtpController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getMeController } from "../controllers/auth.controller.js";
const router = Router();

// health check route
router.post("/health", authHealthCheck);

// send OTP route
router.post("/send-otp", sendOtpController); // storing in redis and sending otp to the user 

router.post("/verify-otp", verifyOtpController); // verifying user otp with stored otp 
// 🔐 protected route
router.get("/me", authMiddleware, getMeController);
export default router;