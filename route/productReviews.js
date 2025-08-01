const { productReview } = require("../models/productReview");
const express = require("express");
const router = express.Router();
 // import multer middleware
const upload = require("../middleweres/upload");




router.get("/", async (req, res) => {
    let review = [];
  try {
    if(req.query.productId !== undefined && req.query.productId !== null && req.query.productId !== ""){
        review = await productReview.find({ productId:req.query.productId});
    }else{
        review = await productReview.find();
    }
    if(!review){
        res.status(500).json({success:false});
    }
   return  res.status(200).json(review);
  } catch (error) {
    console.error("Fetch review error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async(req,res)=>{
    try {
        const review = await productReview.findById(req.params.id)
        return res.status(200).send(review)
    } catch (error) {
        res.status(500).json({
            message:"the review with the given id not found.",
            error:error
        })
    }
})



router.post("/create",upload.none(), async (req, res) => {
  try {
    const review = new productReview({
      productId: req.body.productId,
      customerName: req.body.customerName,
      customerId: req.body.customerId,
      review: req.body.review,
      customerRating: req.body.customerRating,
    });

    const reviewSaved = await review.save();

    res.status(201).json({
      reviewSaved: reviewSaved,
      message: "review submitted",
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
