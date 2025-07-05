const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true // 
  },
  images: [{
    type: String,
    required: true // 
  }],
  colors: {
    type: [String], // array of strings ✅
    default: []
  },

  weights: {
    type: [String], // array of strings ✅
    default: []
  },

  sizes: {
    type: [String], // array of strings ✅
    default: []
  },
  description: {
    type: String,
    default:'' 
  },
  brand: {
    type: String,
    default:'' // 
  },
  price: {
    type: Number,
    default:0  
  },
  oldPrice: {
    type: Number,
    default:0  
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:true,
  },
  countInStock:{
    type:Number,
    required:true,
  },
  rating:{
    type:Number,
    default:0
  },
  numReviews:{
    type:Number,
    default:0
  },
  isFeatured:{
    type: Boolean,
    default:false
  },
  take:{
    type:String,
    default:null
  },
  dateCreated:{
    type:Date,
    default:Date.now
  }
});

exports.Products = mongoose.model("Products", productSchema);