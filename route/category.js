// // const category = require("../models/category");
// const { Category } = require("../models/category");

// const express = require("express");
// const router = express.Router();

// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.Cloudinary_Config_Cloud_Name,
//   api_key: process.env.Cloudinary_Config_api_key,
//   api_secret: process.env.Cloudinary_Config_api_secret,
// });

// router.get("/", async (req, res) => {
//   const categoryList = await Category.find();
//   if (!categoryList) {
//     res.status(500).json({ success: false });
//   }
//   return res.send(categoryList);
// });

// router.get('/:id',async (req,res)=>{
//   const category = await Category.findById(req.params.id);
//   if(!category){
//    return res.status(500).json({
//       message:'The category with the given ID was not found.!'
//     })
//   }
//   return res.status(200).send(category)
// })

// router.delete('/:id',async (req,res)=>{
//   const deletedUser = await Category.findByIdAndDelete(req.params.id);
//   if(!deletedUser){
//     return res.status(404).json({
//       message:"Category Not Found!",
//       success:false
//     })
//   }
//   res.status(200).json({
//     success:true,
//     message:'Category Deleted!'

//   })
// })


// router.post("/create", async (req, res) => {
//   try {
//     const pLimit = (await import("p-limit")).default;
//     const limit = pLimit(2);
//     console.log("req.body.images:", req.body.images);

//     const imageToUpload = req.body.images.map((image) => {
//       return limit(async () => {
//         return await cloudinary.uploader.upload(image);
//       });
//     });

//     const uploadStatus = await Promise.all(imageToUpload);

//     const imgurl = uploadStatus.map((item) => item.secure_url);

//     if (!uploadStatus) {
//       return res.status(500).json({
//         error: "Images cannot upload!",
//         status: false,
//       });
//     }

//     let category = new Category({
//       name: req.body.name,
//       images: imgurl,
//       color: req.body.color,
//     });

//     category = await category.save();

//     res.status(201).json(category);
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({
//       error: err.message || "Something went wrong",
//       success: false,
//     });

//   }
// });


// router.put('/:id',async (req,res)=>{
//    const pLimit = (await import("p-limit")).default;
//     const limit = pLimit(2);
//     console.log("req.body.images:", req.body.images);

//     const imageToUpload = req.body.images.map((image) => {
//       return limit(async () => {
//         return await cloudinary.uploader.upload(image);
//       });
//     });

//     const uploadStatus = await Promise.all(imageToUpload);

//     const imgurl = uploadStatus.map((item) => item.secure_url);

//     if (!uploadStatus) {
//       return res.status(500).json({
//         error: "Images cannot upload!",
//         status: false,
//       });
//     }

//   const category = await Category.findByIdAndUpdate(
//     req.params.id,
//     {
//       name:req.body.name,
//       images:imgurl,
//       color:req.body.color
//     },
//     {new:true}
//   )

//   if(!category){
//     return res.status(500).json({
//       message:'Category cannot be update!',
//       success:false
//     })
//   }else{
//     res.status(201).json({

//       message:'update success',
//       success:true
//     }
//     )
//   }
// })

// module.exports = router;


const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;
const upload = require("../middleweres/upload"); // import multer middleware

cloudinary.config({
  cloud_name: process.env.Cloudinary_Config_Cloud_Name,
  api_key: process.env.Cloudinary_Config_api_key,
  api_secret: process.env.Cloudinary_Config_api_secret,
});

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
      return res.status(500).json({ success: false });
    }
    res.send(categoryList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: "The category with the given ID was not found.",
      });
    }
    res.status(200).send(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category Not Found!",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: "Category Deleted!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE category with image upload
router.post(
  "/create",
  upload.array("images", 5), // multer middleware, max 5 images
  async (req, res) => {
    try {
      const files = req.files; // multer files
      const { name, color } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      // Upload images to Cloudinary with concurrency limit 2
      const pLimit = (await import("p-limit")).default;
      const limit = pLimit(2);

      const uploadPromises = files.map((file) =>
        limit(
          () =>
            new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "categories" },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              stream.end(file.buffer);
            })
        )
      );

      const uploadResults = await Promise.all(uploadPromises);
      const imgurl = uploadResults.map((r) => r.secure_url);

      const category = new Category({
        name,
        color,
        images: imgurl,
      });

      await category.save();

      res.status(201).json({
         success: true,
  message: "Category created successfully!",
  category: category
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({
        error: err.message || "Something went wrong",
        success: false,
      });
    }
  }
);

// UPDATE category with image upload (optional images)
router.put(
  "/:id",
  upload.array("images", 5), // multer middleware
  async (req, res) => {
    try {
      const files = req.files;
      const { name, color } = req.body;

      let imgurl = [];

      if (files && files.length > 0) {
        const pLimit = (await import("p-limit")).default;
        const limit = pLimit(2);

        const uploadPromises = files.map((file) =>
          limit(
            () =>
              new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: "categories" },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                );
                stream.end(file.buffer);
              })
          )
        );

        const uploadResults = await Promise.all(uploadPromises);
        imgurl = uploadResults.map((r) => r.secure_url);
      }

      const updateData = {
        name,
        color,
      };

      if (imgurl.length > 0) {
        updateData.images = imgurl;
      }

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!category) {
        return res.status(404).json({
          message: "Category cannot be updated!",
          success: false,
        });
      }

      res.status(200).json({
        message: "Update success",
        success: true,
        category,
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: err.message, success: false });
    }
  }
);

module.exports = router;
