import mongoose from "mongoose";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import shortid from "shortid";


// 1. Create Product
const createProduct = AsyncHandler(async (req, res) => {
  // 1. Take data from user
  const { name, description, price, materials, category } = req.body;
  if (!name || !description || !category || !price || materials.length <= 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required!"));
  }

  // Check if the provided category ID is valid
  const catDetails = await Category.findById(category);
  
  // If no category is found
  if (!catDetails) {
    return res.status(404).json(new ApiResponse(404, {}, "Category not found"));
  }

  // Proceed
  if (catDetails.parentId === null) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          catDetails.name,
          "You have chosen a root category. Please choose a subcategory!"
        )
      );
  }

  // 2. Check for an image
  if (!req.file?.path) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Product image is required!"));
  }

  const image = await uploadOnCloudinary(req.file?.path, "Products");
  if (!image) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Something went wrong while uploading image!")
      );
  }
  
  // Converting spaces into - for creating proper slug
  const slugProductName = name.split(" ").join("-");
  
  // 3. Create and save product
  const product = await Product.create({
    name,
    description,
    category,
    slug: `${slugProductName}-${shortid.generate()}`,
    price,
    image: image.url,
    materials,
  });

  if (!product) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong!"));
  }

  // 4. Return response
  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully!"));
});

// 2. Get a Particular product details using slug
const getProduct = AsyncHandler(async (req, res) => {
    // 1. Get Slug of product from url parameters
    const { slug } = req.params;
    
    // 2. Fetch product from database
    const product = await Product.findOne({ slug });
    
    if(!product) {
        return res.status(400).json(new ApiResponse(400, {}, "Product not found!"));
    }
    
    // 3. Return product with details
    return res.status(200).json(new ApiResponse(200, product, "Products details fetched successfully!"));
});

export { createProduct, getProduct };
