import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, getProduct, getRandomProduct } from "../controllers/product.controller.js";

const router = Router();

router.route("/").post(upload.single("image"), createProduct);
router.route("/:slug").get(getProduct);
router.route("/random/:qty").get(getRandomProduct);

export default router;