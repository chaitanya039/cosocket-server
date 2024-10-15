import { Router } from "express";
import { loginUser, logoutUser, registerUser, updateProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators/auth.validator.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { orderPayment, verifyPayment } from "../controllers/payment.controller.js";

// Creating mini router
const router = Router();

// Creating routes for user
router.route("/register").post(upload.single("profilePicture"), validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/update-profile").patch(jwtVerify, validate(updateProfileSchema), updateProfile);

// Payment Routes for user
router.route("/order-payment").post(jwtVerify, orderPayment);
router.route("/verify-payment").post(jwtVerify, verifyPayment);


export default router;