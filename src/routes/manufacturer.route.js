import { Router } from "express";
const router = Router();
import { addManufacturers, getManufacturerById, getManufacturers, getTopManufacturers } from "../controllers/manufacturer.controller.js";

router.route("/add").post(addManufacturers);
router.route("/top-manufacturers").get(getTopManufacturers);
router.route("/").post(getManufacturers);
router.route("/:id").get(getManufacturerById);

export default router;
