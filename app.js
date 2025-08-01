


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

const authJwt = require('./middleweres/jwt')

// app.use(express.json());
app.use(cors());
app.options('*',cors())

//middleware
app.use(bodyParser.json())

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(authJwt())






app.use(authJwt().unless({
  path: [
    '/api/user/signin',
    '/api/user/signup',  // <== ត្រូវមាន signup នៅទីនេះ
    { url: '/api/product', methods: ['GET'] },
    { url: '/api/category', methods: ['GET'] },
    { url: new RegExp('^/api/product/category/[^/]+$'), methods: ['GET'] },
    { url: new RegExp('^/api/product/[^/]+$'), methods: ['GET'] },
    { url: new RegExp('^/api/category/[^/]+$'), methods: ['GET'] }
  ]
}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid token' });
  } else {
    next(err);
  }
});




const categoryRoutes = require('./route/category');
app.use(`/api/category`,categoryRoutes);

// products 
const productsRoutes = require('./route/products')
app.use(`/api/product`,productsRoutes)
const userRoutes = require('./route/user')
app.use(`/api/user`,userRoutes)

// cart
const cart = require('./route/cart')
app.use(`/api/cart`,cart)
const review = require('./route/productReviews')
app.use(`/api/review`,review)

const wishlist = require('./route/myList')
app.use(`/api/wishlist`,wishlist)

const Order = require('./route/order')
app.use(`/api/order`,Order)


const homeBanner = require('./route/homeBanner')
app.use(`/api/homeBanner`,homeBanner)

const slideBanner = require('./route/slideBanner')
app.use(`/api/slideBanner`,slideBanner)
const bannerButtom = require('./route/BannerButtom')
app.use(`/api/bannerButtom`,bannerButtom)


mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('database Connection is ready...')
})
.catch((err)=>{
    console.log(err)
})


app.listen(process.env.PORT,()=>{
    console.log(`server running http://localhost:${process.env.PORT}`)
})