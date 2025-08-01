const { Cart } = require("../models/cart");
const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;
const upload = require("../middleweres/upload"); // import multer middleware

cloudinary.config({
  cloud_name: process.env.Cloudinary_Config_Cloud_Name,
  api_key: process.env.Cloudinary_Config_api_key,
  api_secret: process.env.Cloudinary_Config_api_secret,
});



router.get("/user/:userId", async (req, res) => {
  try {
    const userCart = await Cart.find({ userId: req.params.userId });
    res.status(200).json(userCart);
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE category by ID
router.delete("/:id", async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      res.status(404).json({
        message: "The cart item not found!",
      });
    }
    const deleteItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deleteItem) {
      return res.status(404).json({
        message: "Cart Not Found!",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart Deleted!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // លុបកាតទាំងអស់ដែលមាន userId
    const result = await Cart.deleteMany({ userId: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No cart items found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} cart items deleted for user ${userId}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





router.post("/create", async (req, res) => {
  try {
    const cartList = new Cart({
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: req.body.rating,
      quantity: req.body.quantity,
      price: req.body.price,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId,
    });

    const savedCart = await cartList.save();

    res.status(201).json({
      cartList: savedCart,
      message: "Product added to cart!",
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});


// update
router.put("/:id", async (req, res) => {
  try {
    const cartList = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        productTitle: req.body.productTitle,
        image: req.body.image,
        rating: req.body.rating,
        quantity: req.body.quantity,
        price: req.body.price,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userId: req.body.userId,
      },
      { new: true }
    );

    if (!cartList) {
      return res.status(404).json({
        message: "Cart item not found.",
        success: false,
      });
    }

    res.status(200).json({
      cartList,
      message: "Cart updated successfully.",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});


router.get('/count', async(req,res)=>{
 try {
     const CartItem = await Cart.find().countDocuments(); 
 
     res.status(200).json({
       success: true,
       CartItem: CartItem
     });
   } catch (err) {
     res.status(500).json({
       success: false,
       message: err.message
     });
   }
})



module.exports = router;
