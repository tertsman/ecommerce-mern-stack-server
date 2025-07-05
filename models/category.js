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

// ✅ Capitalize model name: 'Category'
// ✅ Use module.exports (more common)
// module.exports = mongoose.model('Category', categorySchema);
exports.Category = mongoose.model("Category", categorySchema);