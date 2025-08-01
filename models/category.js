const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true // 
  },
  images: [{
    type: String,
    required: true // ❗ require → required
  }],
  color: {
    type: String,
    required: true // ❗ require → required
  }
});

exports.Category = mongoose.model("Category", categorySchema);