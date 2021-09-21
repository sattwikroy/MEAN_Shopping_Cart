const bodyParser = require('body-parser');
const { Double } = require('bson');
const mongoose = require('mongoose');
const config = require('../config/database');
const Product = require('./products');
const User = require('./users');

// OrderSchema
const OrderSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: true
    },
    paymentmethod: {
      type: String,
      required: true
    },
    productlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: Product
    },
    address: {
      type: String,
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
    },
});

const Order = module.exports = mongoose.model('Order', OrderSchema );

module.exports.makeOrder = function (newOrder, callback){
  newOrder.save(callback);
};

module.exports.getAllOrders = function( user_id,res,callback){
  Order.find({user_id : user_id}, function (err, Orders) {
    if (err) {
      throw err;
    }
    else{
      res.json(Orders);
    }
  });
}
module.exports.cancelOrder = function(id,callback){
  Order.deleteOne({_id: id},callback);
}