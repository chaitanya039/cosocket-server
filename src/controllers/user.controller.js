import User from "../models/user.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Options for cookies
const options = {
  httpOnly: true,
  secure: false,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Function to generate Refresh and Access token
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

// Controller to register user
const registerUser = AsyncHandler(async (req, res, next) => {
  /*
        1. Take data of user from frontend
        2. Apply validations
        3. Check user exits with their email only
        4. Check for profileImage
        5. Upload them onto cloudinary
        6. Create User object into DB
        7. Remove password and refresh token field from the response
        8. Check user created or not
        9. Return response
    */
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  const address = {
    street: req.body["address.street"] || "",
    city: req.body["address.city"] || "",
    state: req.body["address.state"] || "",
    postalcode: req.body["address.postalcode"] || "",
    country: req.body["address.country"] || "",
  };

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "User with this email already exists"));
  }

  if (!req.file?.path) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Profile picture is required"));
  }

  const profilePicture = await uploadOnCloudinary(req.file?.path, "Users");
  if (!profilePicture) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Profile picture is required"));
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    profilePicture: profilePicture.url,
    address,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registration");
  }

  return res
  .status(201)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: createdUser,
        accessToken,
        refreshToken,
      },
      "User registered in successfully!"
    )
  );
});

const loginUser = AsyncHandler(async (req, res, next) => {
  /*
    1. Get data from user
    2. Check user exists or not
    3. Compare password matching or not
    4. Generate token by passing user ID
    5. Save refresh token into user document
    6. Set data and option to res.cookies
    7. Return reponse to user
  */
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User does not exists"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Invalid Credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully!"
      )
    );
});

const logoutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // This removes the field from document
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully!"));
});

const updateProfile = AsyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  const user = await User.findOneAndUpdate(
    req.user?._id,
    {
      $set: {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully!"));
});

export { registerUser, loginUser, logoutUser, updateProfile };
