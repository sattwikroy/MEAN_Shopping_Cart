const express = require('express');
const router = express.Router();
const url = require('url');
const config = require('../config/database');
const product = require('../models/products');

// Profile
router.get('/get', (req,res)=>{
    product.getAllProducts(res);
});

router.get('/:id', (req,res)=>{
    var id = req.params.id;
    product.getProductById(id,res);
});

module.exports= router;