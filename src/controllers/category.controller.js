import { AsyncHandler } from "../utils/AsyncHandler.js";
import shortid from "shortid";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Category from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";

const retrieveCategories = (categories, parentId = null) => {
    const newCategoryList = [];

    // 1. Filter categories by parentId
    const updatedCategories = categories.filter((cat) => {
        if(parentId === null) {
            return cat.parentId === null;
        } else {
            return cat.parentId && cat.parentId.toString() === parentId.toString();
        }
    });

    // 2. Process each category and retrieve its children recursively
    for (const category of updatedCategories) {
        newCategoryList.push({
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
            slug: category.slug,
            parentId: category.parentId,
            // Recursively add children categories
            children: retrieveCategories(categories, category._id)
        });
    }
    
    // 3. Return new categories list
    return newCategoryList;
};


// 1. Create Category
const createCategory = AsyncHandler(async (req, res) => {
    
    // 1. Taking data from the user
    const { name, description, parentId } = req.body;
    const slug = `${name}-${shortid.generate()}`;
    let imageUrl = "https://res.cloudinary.com/dyfwg1lmg/image/upload/v1726033709/commanImageCategory_ab7k9y.png";
    
    if(req.file?.path) {
        const image = await uploadOnCloudinary(req.file?.path, "Categories");
        imageUrl = image.url;
    }
    
    // 2. Creating new instance of category
    const newCategory = new Category({
        name,
        description,
        slug,
        parentId: parentId || null,
        image: imageUrl
    });
    
    // 3. Saving it into database
    const response = await newCategory.save();
    
    if(!response)
        return res.status(500).json(new ApiResponse(500, {}, "Internel server error!"));
    
    return res.status(200).json(new ApiResponse(200, response, "Category created successfully!"));
});

// 2. Get childrens of category with current category details
const getChildren = AsyncHandler(async (req, res) => {
    const { slug } = req.params;
    
    // Get category by slug
    const category = await Category.findOne({ slug });
    
    if(!category) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid Category!"));
    }
    
    // Get Children of category using id
    const childCategories = await Category.find({ parentId: category._id });
    let children = [];
    
    // Get products of child category
    for(let i = 0; i < childCategories.length; i++) {
        var products = await Product.find({ category: childCategories[i]._id });
        children.push({
            ...childCategories[i]._doc,
            products: products
        });
    }
    
    // Creating new structure for category and it's children
    const newCategory = {
        ...category._doc,
        children
    }
        
    return res.status(200).json(new ApiResponse(200, newCategory, "Children categories fetched successfully!"));
});

// 3. Get All Root Categories
const getParentCategories = AsyncHandler(async (req, res) => {
    const categories = await Category.find({ parentId: null });
    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully!"));
});

// 4. Update Category

// 5. Delete Category


export { createCategory, getParentCategories, getChildren };
