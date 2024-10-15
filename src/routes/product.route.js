import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, getProduct } from "../controllers/product.controller.js";

const router = Router();

router.route("/").post(upload.single("image"), createProduct);
router.route("/:slug").get(getProduct);

export default router;