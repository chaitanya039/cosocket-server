import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { getInspectionSteps, getOperations, getSourcing, getVariants } from "../controllers/gpt.controller.js";

// Router
const router = Router();

// Routes
router.route("/inspection/:product").get(getInspectionSteps);
router.route("/variants/:product").post(getVariants);
router.route("/operations/:product").get(getOperations);
router.route("/sourcing/:product").get(getSourcing);

// Export
export default router;