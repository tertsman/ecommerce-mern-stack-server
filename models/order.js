const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      productId: String,
      productTitle: String,
      quantity: Number,
      price: Number,
      image:String,
      userId:String,
      rating:Number,
      subTotal:String
    },
  ],
  address: [
    {
      name: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
  ],

  amount: { type: Number, required: true },
  tran_id: { type: String, required: true, unique: true },
  paymentStatus: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// ✅ Make sure virtuals are included in JSON
orderSchema.set("toJSON", {
  virtuals: true,
});
exports.Order = mongoose.model("Order", orderSchema);
exports.orderSchema = orderSchema;
