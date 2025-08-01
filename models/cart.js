const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  productTitle: {
    type: String,
  },
  image: {
    type: String,
    required: true,
    
  },
  rating: {
    type: String,
    required: true,
    
  },
  quantity: {
    type: Number,
    required: true,
   
  },
  price: {
    type: Number,
    required: true 
  },
  subTotal:{
     type: Number,
    required: true 
  },
  productId:{
    type:String,
    require:true
  }
  ,
  userId:{
    type:String,
    require:true
  }
  

});

cartSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// ✅ Make sure virtuals are included in JSON
cartSchema.set("toJSON", {
  virtuals: true,
});
exports.Cart = mongoose.model("Cart", cartSchema);
exports.cartSchema = cartSchema;