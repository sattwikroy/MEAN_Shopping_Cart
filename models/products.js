const { Double } = require('bson');
const mongoose = require('mongoose');
const config = require('../config/database');

// Maintainance Schema
const maintainanceSchema = new mongoose.Schema({
    light: {
        type: String
         
    },
      watering: {
        type: String
         
    },
      place: {
        type: String
         
    },
      care: {
          type: String
           
    },
      spl_f: {
        type: String
         
    },
    
},{ _id : false });

// ToolsSchema
const toolsSchema = new mongoose.Schema({
  weight: {
      type: Number
       
  },
    height: {
      type: Number
       
  },
    width: {
      type: Number
       
  },
    depth: {
        type: Number
         
  },
    material: {
      type: String
       
  },
  
},{ _id : false });

// Use Schema
const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
       
    },
    sci_name: {
      type: String
       
    },
    desc: {
      type: String
       
    },
    price: {
        type: Number
         
    },
    maintainance: {
        type: maintainanceSchema
    } ,
    specifications: {
      type: toolsSchema
    }    

});

const Product = module.exports = mongoose.model('Product', ProductSchema );

module.exports.getProductById = function(id, res, callback){
    Product.findById(id,(err, Product) => {
      if (err) {
        throw err;
      }
      else{
        res.json(Product);
      }
    });
}

module.exports.getAllProducts = function(res,callback){
    Product.find({}, (err, Products) => {
      if (err) {
        throw err;
      }
      else{
        res.json(Products);
      }
    });
}
