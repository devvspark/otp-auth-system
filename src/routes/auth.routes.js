import { Router } from "express";
import { authHealthCheck } from "../controllers/auth.controller.js";

const router = Router();

// health check route
router.post("/health", authHealthCheck);

export default router;