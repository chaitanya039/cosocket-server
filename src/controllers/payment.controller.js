import Razorpay from "razorpay";
import crypto from "crypto";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});

const orderPayment = AsyncHandler(async (req, res) => {
    // 1. Take data from user
    // 2. Create options for razorpay
    // 3. Create order using razorpay instance
    // 4. Send response
    const { amount } = req.body;
    const options = {
        amount: Number(amount) * 100,
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex")
    }
    razorpayInstance.orders.create(options, (error, order) => {
        if(error) {
            console.log(error);
            throw new ApiError(500, error?.message || "Something while doing payment");
        }
        
        return res.status(200).json(
            new ApiResponse(200, order, "Payment ordered successfully")
        );
    })
});

const verifyPayment = AsyncHandler(async (req, res) => {
    // 1. Take data from user
    // 2. Create signature
    // 3. Create expected sign using orderID and paymentID
    // 4. Compare both signatures 
    // 5. If it is authenticated save it into user model
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
                         .update(sign.toString())
                         .digest("hex");
    const isAuthentic = expectedSign === razorpay_signature;
    if(isAuthentic) {
        const payment = {
            orderID: razorpay_order_id,
            paymentID: razorpay_payment_id,
            sign: razorpay_signature,
            status: true
        }
        const user = await User.findById(req.user._id);
        
        if(!user) {
            throw new ApiError(500, "Something went wrong!");
        }
        user.payment = payment;
        const response = await user.save({ validateBeforeSave: false });
        const updatedUser = await User.findById(response._id).select("-password -refreshToken");
        return res
        .status(200)
        .json(
            new ApiResponse(200, updatedUser, "Payment done successfully!")
        );
    }
});

export { orderPayment, verifyPayment }