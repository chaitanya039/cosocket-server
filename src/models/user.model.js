import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const Schema = mongoose.Schema;

// Address Schema for User
const addressSchema = new Schema({
  street: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalcode: { type: String, required: true },
  country: { type: String, required: true },
});

// Payment Schema for User
const paymentSchema = new Schema({
  orderID: { type: String, default: "" },
  paymentID: { type: String, default: "" },
  sign: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  status: { type: Boolean, default: false }, // Added payment status field init
});

// OTP Schema for User
const otpSchema = new Schema({
  code: { type: String },
  expiresAt: { type: Date },
});

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      length: 6,
    },
    password: {
      type: String,
      required: true,
      length: 6,
    },
    refreshToken: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      type: addressSchema,
      default: {}
    },
    payment: {
      type: paymentSchema,
      default: {}
    },
    otp: otpSchema,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.firstName + " " + this.lastName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
