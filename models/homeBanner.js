const mongoose = require('mongoose');

const homeBannerSchema = mongoose.Schema({
  
  image: {
    type: String,
    required: true // ❗ require → required
  },
 
});


homeBannerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// ✅ Make sure virtuals are included in JSON
homeBannerSchema.set("toJSON", {
  virtuals: true,
});
exports.HomBanner = mongoose.model("HomeBanner", homeBannerSchema);
exports.homeBannerSchema = homeBannerSchema;