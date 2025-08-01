const express = require("express");
const { Category } = require("../models/category");
const { Products } = require("../models/products");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const upload = require("../middleweres/upload");
cloudinary.config({
  cloud_name: process.env.Cloudinary_Config_Cloud_Name,
  api_key: process.env.Cloudinary_Config_api_key,
  api_secret: process.env.Cloudinary_Config_api_secret,
});


router.get("/", async (req, res) => {

  const isFeatured = req.query.isFeatured;
  let filter = {};

  if (isFeatured === "true") {
    filter.isFeatured = true;
  }

  try {
    // ✅ Filter by isFeatured if query exists
    const productList = await Products.find(filter).populate("category");
    if (!productList) {
      return res.status(500).json({
        success: false,
        message: "Products not found",
      });
    }

    return res.status(200).json(productList);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const products = await Products.find({ category: req.params.categoryId }).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// get product 1
router.get("/:id", async (req, res) => {
  const {id} = req.params
  
  const product = await Products.findById(id).populate("category");
  if (!product) {
    return res.status(500).json({
      message: "The product with the given ID was not found.!",
    });
  }
  return res.status(200).send(product);
});

// ==============
// create
router.post("/create", upload.array("images", 10), async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    const imageUrls = await Promise.all(
      req.files.map(file =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      )
    );


   // ['small', 'medium']

    const product = new Products({
      name: req.body.name,
      images: imageUrls,
      description: req.body.description,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      take: req.body.take,
      colors: req.body.colors,   // <-- បញ្ចូល colors array
  weights: req.body.weights, // <-- បញ្ចូល weights array
  sizes: req.body.sizes, 
      dateCreated: req.body.dateCreated || new Date(),
    });

    const saved = await product.save();
    res.status(201).send(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Product creation failed!" });
  }
});

// UPDATE product
router.put("/:id", upload.array("images", 10), async (req, res) => {
  try {
    // 🟡 Parse existing image URLs (from frontend)
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    // 🔵 Upload new images to Cloudinary (if any)
    let newImageUrls = [];
    if (req.files?.length > 0) {
      newImageUrls = await Promise.all(
        req.files.map(file =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "products" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
        )
      );
    }

    //  Final image list = existing + newly uploaded
    const finalImageList = [...existingImages, ...newImageUrls];

    //  Update product
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        images: finalImageList,
        description: req.body.description,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        take:req.body.take,
        colors: req.body.colors,   // <-- បញ្ចូល colors array
        weights: req.body.weights, // <-- បញ្ចូល weights array
        sizes: req.body.sizes,
        dateCreated: req.body.dateCreated || new Date(),
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Product update failed!" });
  }
});


// router.delete("/:id", async (req, res) => {
//   const deletedUser = await Products.findByIdAndDelete(req.params.id);
//   if (!deletedUser) {
//     return res.status(404).json({
//       message: "product Not Found!",
//       success: false,
//     });
//   }
//   res.status(200).json({
//     success: true,
//     message: "Product Deleted!",
//   });
// });

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // validate ObjectId
  if (!id || id === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Invalid Product ID",
    });
  }

  try {
    const deletedUser = await Products.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        message: "Product Not Found!",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: "Product Deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});


module.exports = router;
