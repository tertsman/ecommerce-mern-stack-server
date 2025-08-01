
const { BannerButtom } = require("../models/bannerBottum");
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
    const BannerBottomList = await BannerButtom.find();
    if (!BannerBottomList) {
      return res.status(500).json({ success: false });
    }
    res.send(BannerBottomList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const BannerBottomList = await BannerButtom.findById(req.params.id);
    if (!BannerBottomList) {
      return res.status(404).json({
        message: "The category with the given ID was not found.",
      });
    }
    res.status(200).send(BannerBottomList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedBannerButtom = await BannerButtom.findByIdAndDelete(req.params.id);
    if (!deletedBannerButtom) {
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
          { folder: "BannerButton" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });


      const bannerButtomL = new BannerButtom({
        image: result.secure_url, // save single URL as string
      });

      await bannerButtomL.save();

      res.status(201).json({
        success: true,
        message: "homeBannerL created successfully!",
        bannerButtomL: bannerButtomL
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





router.put(
  "/:id",
  upload.single("image"), // single image
  async (req, res) => {
    try {
      const file = req.file;

      // Find existing document
      const banner = await BannerButtom.findById(req.params.id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      let imageUrl = banner.image; // default: keep old image

      if (file) {
        // 🔁 Optional: Delete old image from Cloudinary
        const oldPublicId = banner.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`BannerButton/${oldPublicId}`);

        // 📤 Upload new image
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "BannerButton" },
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
