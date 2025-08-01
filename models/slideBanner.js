const mongoose = require('mongoose');

const slideBannerSchema = mongoose.Schema({
  
  image: {
    type: String,
    required: true // ❗ require → required
  },
 
});


slideBannerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// ✅ Make sure virtuals are included in JSON
slideBannerSchema.set("toJSON", {
  virtuals: true,
});
exports.SlideBanner = mongoose.model("SlideBanner", slideBannerSchema);
exports.slideBannerSchema = slideBannerSchema;