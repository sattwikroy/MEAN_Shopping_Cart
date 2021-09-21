const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Order = require('../models/orders');

router.get('/get',passport.authenticate('jwt', {session:false}), (req,res)=>{
    Order.getAllOrders(req.user._id,res);
});

router.post('/order', passport.authenticate('jwt', {session:false}), (req,res)=>{
    let newOrder = new Order({
        amount: req.body.amount,
        paymentmethod: req.body.paymentmethod,
        productlist: req.body.productlist,
        address: req.body.address,
        user_id: req.body.user_id
    });
    Order.makeOrder(newOrder, (err,Order)=>{
        if(err){
            console.log(err);
            res.json({success: false, msg:'Could not Complete Order, Someting went wrong :('});
        }
        else {
           res.json({success: true, msg:'Order Successfull !'});
        }
    });
    
});

router.post("/cancel", passport.authenticate('jwt', {session:false}), (req,res)=>{
	Order.cancelOrder(req.body.delete_id, (err)=>{
        if(err){
            res.json({success: false, msg:'Could not cancel order, Someting went wrong :('});
        }
        else {
           res.json({success: true, msg:'Order Successfully Cancelled!'});
        }
    });
});
module.exports= router;