const { MyList } = require("../models/myList");
const express = require("express");
const router = express.Router();

// const cloudinary = require("cloudinary").v2;
// const upload = require("../middleweres/upload"); // import multer middleware

// cloudinary.config({
//   cloud_name: process.env.Cloudinary_Config_Cloud_Name,
//   api_key: process.env.Cloudinary_Config_api_key,
//   api_secret: process.env.Cloudinary_Config_api_secret,
// });



router.get("/user/:userId", async (req, res) => {
  try {
    const myList = await MyList.find({ userId: req.params.userId });
    res.status(200).json(myList);
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE category by ID
router.delete("/:id", async (req, res) => {
  try {
    const listItem = await MyList.findById(req.params.id);
    if (!listItem) {
      res.status(404).json({
        message: "The cart item not found!",
      });
    }
    const deleteItem = await MyList.findByIdAndDelete(req.params.id);
    if (!deleteItem) {
      return res.status(404).json({
        message: "List Not Found!",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: "wishlist Deleted!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.post("/create", async (req, res) => {
  try {
    const myList = new MyList({
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: req.body.rating,
      price: req.body.price,
      productId: req.body.productId,
      userId: req.body.userId,
    });

    const saveList = await myList.save();

    res.status(201).json({
      myList: saveList,
      message: "Product added to wishlist!",
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});


// update
router.put("/:id", async (req, res) => {
  try {
    const myList = await MyList.findByIdAndUpdate(
      req.params.id,
      {
        productTitle: req.body.productTitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        productId: req.body.productId,
        userId: req.body.userId,
      },
      { new: true }
    );

    if (!myList) {
      return res.status(404).json({
        message: "wishlist item not found.",
        success: false,
      });
    }

    res.status(200).json({
      myList,
      message: "wishlist updated successfully.",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});


router.get('/count', async(req,res)=>{
 try {
     const listItem = await MyList.find().countDocuments(); 
 
     res.status(200).json({
       success: true,
       listItem: listItem
     });
   } catch (err) {
     res.status(500).json({
       success: false,
       message: err.message
     });
   }
})



module.exports = router;
