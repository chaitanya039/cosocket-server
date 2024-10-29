import { Router } from "express";
const router = Router();
import { addManufacturers, getManufacturerById, getManufacturers } from "../controllers/manufacturer.controller.js";

router.route("/add").post(addManufacturers);
router.route("/").post(getManufacturers);
router.route("/:id").get(getManufacturerById);

export default router;
