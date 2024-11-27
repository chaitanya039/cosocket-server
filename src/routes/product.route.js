import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, getProduct, getRandomProduct, searchProduct } from "../controllers/product.controller.js";

const router = Router();

router.route("/").post(upload.single("image"), createProduct);
router.route("/search").get(searchProduct);
router.route("/:slug").get(getProduct);
router.route("/random/:qty").get(getRandomProduct);

export default router;