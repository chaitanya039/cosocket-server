import { Router } from "express";
const router = Router();
import { addManufacturers, getManufacturers } from "../controllers/manufacturer.controller.js";

router.route("/add").post(addManufacturers);
router.route("/").post(getManufacturers);

export default router;
