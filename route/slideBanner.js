
const { SlideBanner } = require("../models/slideBanner");
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
    const slideBannerList = await SlideBanner.find();
    if (!slideBannerList) {
      return res.status(500).json({ success: false });
    }
    res.send(slideBannerList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const slideBannerList = await SlideBanner.findById(req.params.id);
    if (!slideBannerList) {
      return res.status(404).json({
        message: "The category with the given ID was not found.",
      });
    }
    res.status(200).send(slideBannerList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedSlideBanner = await SlideBanner.findByIdAndDelete(req.params.id);
    if (!deletedSlideBanner) {
      return res.status(404).json({
        message: "banner Not Found!",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: "banner Deleted!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE category with image upload
// router.post(
//   "/create",
//   upload.single("images"), // multer middleware, max 5 images
//   async (req, res) => {
//     try {
//       const file = req.file; // multer files

//       if (!file || file.length === 0) {
//         return res.status(400).json({ message: "No images uploaded" });
//       }

//       // Upload images to Cloudinary with concurrency limit 2
//       const pLimit = (await import("p-limit")).default;
//       const limit = pLimit(2);

//       const uploadPromises = file.map((file) =>
//         limit(
//           () =>
//             new Promise((resolve, reject) => {
//               const stream = cloudinary.uploader.upload_stream(
//                 { folder: "categories" },
//                 (error, result) => {
//                   if (error) reject(error);
//                   else resolve(result);
//                 }
//               );
//               stream.end(file.buffer);
//             })
//         )
//       );

//       const uploadResults = await Promise.all(uploadPromises);
//       const imgurl = uploadResults.map((r) => r.secure_url);

//       const category = new Category({
//         name,
//         color,
//         images: imgurl,
//       });

//       await category.save();

//       res.status(201).json({
//          success: true,
//   message: "Category created successfully!",
//   category: category
//       });
//     } catch (err) {
//       console.error("Upload error:", err);
//       res.status(500).json({
//         error: err.message || "Something went wrong",
//         success: false,
//       });
//     }
//   }
// );


// Assuming you have `name` and `color` sent from frontend in req.body
router.post(
  "/create",
  upload.single("image"), // Accept a single image file with key "images"
  async (req, res) => {
    
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      // Upload single image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "slidebanner" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });


      const slideBannerL = new SlideBanner({
        image: result.secure_url, // save single URL as string
      });

      await slideBannerL.save();

      res.status(201).json({
        success: true,
        message: "homeBannerL created successfully!",
        slideBannerL: slideBannerL
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Something went wrong",
      });
    }
  }
);


// UPDATE category with image upload (optional images)
// router.put(
//   "/:id",
//   upload.array("images", 5), // multer middleware
//   async (req, res) => {
//     try {
//       const files = req.files;
//       const { name, color } = req.body;

//       let imgurl = [];

//       if (files && files.length > 0) {
//         const pLimit = (await import("p-limit")).default;
//         const limit = pLimit(2);

//         const uploadPromises = files.map((file) =>
//           limit(
//             () =>
//               new Promise((resolve, reject) => {
//                 const stream = cloudinary.uploader.upload_stream(
//                   { folder: "categories" },
//                   (error, result) => {
//                     if (error) reject(error);
//                     else resolve(result);
//                   }
//                 );
//                 stream.end(file.buffer);
//               })
//           )
//         );

//         const uploadResults = await Promise.all(uploadPromises);
//         imgurl = uploadResults.map((r) => r.secure_url);
//       }

//       const updateData = {
//         name,
//         color,
//       };

//       if (imgurl.length > 0) {
//         updateData.images = imgurl;
//       }

//       const category = await Category.findByIdAndUpdate(
//         req.params.id,
//         updateData,
//         { new: true }
//       );

//       if (!category) {
//         return res.status(404).json({
//           message: "Category cannot be updated!",
//           success: false,
//         });
//       }

//       res.status(200).json({
//         message: "Update success",
//         success: true,
//         category,
//       });
//     } catch (err) {
//       console.error("Update error:", err);
//       res.status(500).json({ message: err.message, success: false });
//     }
//   }
// );


router.put(
  "/:id",
  upload.single("image"), // single image
  async (req, res) => {
    try {
      const file = req.file;

      // Find existing document
      const banner = await SlideBanner.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      let imageUrl = banner.image; // default: keep old image

      if (file) {
        // 🔁 Optional: Delete old image from Cloudinary
        const oldPublicId = banner.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`slidebanner/${oldPublicId}`);

        // 📤 Upload new image
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "slidebanner" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        imageUrl = result.secure_url;
      }

      // Update DB with new image (or keep old)
      banner.image = imageUrl;
      await banner.save();

      res.status(200).json({
        success: true,
        message: "Image updated successfully!",
        banner,
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);


module.exports = router;
