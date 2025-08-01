const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true // 
  },
  phone: {
    type: String,
    required: true,
    unique:true  // ❗ require → required
  },
  email: {
    type: String,
    required: true,
    unique:true 
  },
  password: {
    type: String,
    required: true // ❗ require → required
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' // ប្រើ role ជាមូលដ្ឋាន
  }

});

userSchema.virtual('id').get(function (){
  return this._id.toHexString()
})
userSchema.set('toJSON',{
  virtual:true
})
exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;