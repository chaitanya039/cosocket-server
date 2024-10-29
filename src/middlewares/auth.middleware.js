import User from "../models/user.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const jwtVerify = AsyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || 
                      req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiResponse(401, {}, "Please login to access services!");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user from DB
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiResponse(401, {}, "Invalid token, please login again!");
        }

        // Attach user object to request
        req.user = user;
        
        next();
    } catch (error) {
        // Handle token expiration and other JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json(new ApiResponse(401, {}, "Session expired. Please login again!"));
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json(new ApiResponse(401, {}, "Invalid token. Please login again!"));
        } else {
            // Handle other errors
            next(error);
        }
    }
});

export { jwtVerify };
