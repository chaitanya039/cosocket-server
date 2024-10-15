import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { getInspectionSteps, getOperations, getVariants } from "../controllers/gpt.controller.js";

// Router
const router = Router();

// Routes
router.route("/inspection/:product").get(jwtVerify, getInspectionSteps);
router.route("/variants/:product").post(getVariants);
router.route("/operations/:product").get(getOperations);

// Export
export default router;