const { Order } = require("../models/order");
const express = require("express");
const router = express.Router();

// const cloudinary = require("cloudinary").v2;
// const upload = require("../middleweres/upload"); // import multer middleware

// cloudinary.config({
//   cloud_name: process.env.Cloudinary_Config_Cloud_Name,
//   api_key: process.env.Cloudinary_Config_api_key,
//   api_secret: process.env.Cloudinary_Config_api_secret,
// });



router.get("/user/:userId", async (req, res) => {
  try {
    const OrderList = await Order.find({ userId: req.params.userId });
    res.status(200).json(OrderList);
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); // ✅ សូមប្រើ findById
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Fetch order error:", error);
    res.status(500).json({ message: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // -1 = DESC
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch order error:", error);
    res.status(500).json({ message: error.message });
  }
});



// DELETE category by ID
router.delete("/:id", async (req, res) => {
  try {
    const listItem = await Order.findById(req.params.id);
    if (!listItem) {
      res.status(404).json({
        message: "The cart item not found!",
      });
    }
    const deleteItem = await Order.findByIdAndDelete(req.params.id);
    if (!deleteItem) {
      return res.status(404).json({
        message: "List Not Found!",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      message: "wishlist Deleted!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/create", async (req, res) => {
  // console.log(req.body)
  try {
    const newOrder  = new Order({
      userId: req.body.userId,
      cartItems: req.body.cartItems,
      address: req.body.address,
      amount: req.body.amount,
      productId: req.body.productId,
      tran_id: req.body.tran_id,
      paymentStatus: req.body.paymentStatus,
    });

    const saveList = await newOrder.save();

    res.status(201).json({
      Order: saveList,
      message: "Order Success!",
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});

router.put(
  "/:id", // multer middleware
  async (req, res) => {
    try {
      

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          userId: req.body.userId,
          cartItems: req.body.cartItems,
          address: req.body.address,
          amount: req.body.amount,
          productId: req.body.productId,
          tran_id: req.body.tran_id,
          paymentStatus: req.body.paymentStatus,
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          message: "Order cannot be updated!",
          success: false,
        });
      }

      res.status(200).json({
        message: "Update success",
        success: true,
        order,
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: err.message, success: false });
    }
  }
);



const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});












module.exports = router;
