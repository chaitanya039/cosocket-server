import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 25,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      min: 3,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    materials: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);
export default Product;
