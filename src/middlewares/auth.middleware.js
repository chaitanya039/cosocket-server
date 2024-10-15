import User from "../models/user.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
/*
    1. Accept jwt token from user either in the form of cookies or Authorization header
    2. If token not exists throw error
    3. Else verify token find respective user from DB 
    4. If user not exists token in invalid
    5. Else make modify request object and make req.user = user you got from DB 
    6. return reponse
*/

const jwtVerify = AsyncHandler ( async (req, res, next) => {
    const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token) {
        throw new ApiError(401, "Unauthorized Request!");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user) {
        throw new ApiError(401, "Unauthorized Request!");
    }
    req.user = user;
    next();
});

export { jwtVerify };