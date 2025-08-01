const mongoose = require('mongoose');

const bannerBottumSchema = mongoose.Schema({
  
  image: {
    type: String,
    required: true // ❗ require → required
  },
 
});


bannerBottumSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// ✅ Make sure virtuals are included in JSON
bannerBottumSchema.set("toJSON", {
  virtuals: true,
});
exports.BannerButtom = mongoose.model("BannerButtom", bannerBottumSchema);
exports.bannerBottumSchema = bannerBottumSchema;