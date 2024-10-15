import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createCategory, getChildren, getParentCategories } from "../controllers/category.controller.js";

const router = Router();

router.route("/").post(upload.single("image"), createCategory);
router.route("/").get(getParentCategories);
router.route("/:slug").get(getChildren);

export default router;