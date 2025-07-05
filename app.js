


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

app.use(cors());
app.options('*',cors())

//middleware
app.use(bodyParser.json())


const categoryRoutes = require('./route/category');
app.use(`/api/category`,categoryRoutes);

// products 
const productsRoutes = require('./route/products')
app.use(`/api/product`,productsRoutes)

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