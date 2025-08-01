const mongoose = require('mongoose');

const myListSchema = mongoose.Schema({
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
  price: {
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

myListSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// ✅ Make sure virtuals are included in JSON
myListSchema.set("toJSON", {
  virtuals: true,
});
exports.MyList = mongoose.model("MyList", myListSchema);
exports.myListSchema = myListSchema;