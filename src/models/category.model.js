import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 25,
      trim: true,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      min: 3,
      trim: true,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);
export default Category;
