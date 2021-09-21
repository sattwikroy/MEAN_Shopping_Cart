const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/users');

// Register
 router.post('/register', (req,res)=>{
     let newUser = new User({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password
     });
     User.addUser(newUser, (err,user)=>{
         if(err){
             res.json({success: false, msg:'Could not Register, Someting went wrong :('});
         }
         else {
            res.json({success: true, msg:'Registration Successfull ! You may Sign in now'});
         }
     });
     
 });

 // Authenticate
 router.post('/authenticate', (req,res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    User.getUserByEmail(email, (err,user)=>{
        if(err) throw err;
        //If User not found
        if(!user) {
            return res.json({success: false, msg: "No users with that email exist. You may want to Sign up instead."});
        }
        //Compare password to find match
        User.comparePassword(password,user.password, (err, isMatch) => {
            if(err) throw err;
            //When User Match
            if(isMatch){
                const token = jwt.sign({data :user}, config.secret, {
                    expiresIn : 604800 // 1 Week
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user:{
                        id: user._id,
                        name: user.name,
                        email: user.email
                    },
                    msg:'Succesfully Logged in'
                });
            } 
            //If No Match
            else {
                return res.json({success: false, msg: 'Please Check your password'});
            }
        })
    })
});

// Profile
router.get('/user', passport.authenticate('jwt', {session:false}), (req,res)=>{
    res.json({user:req.user});
});

router.post('/update', passport.authenticate('jwt', {session:false}), (req,res)=>{
    let updatedUser = {
        id: req.body._id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address
    };
    User.editUser(updatedUser, (err,user) => {
        if(err) {
            return res.json({success: false, msg:'Could not update now, Try again later'});
        }
        else{
            return res.json({
                success: true,                
                user:{
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                msg: 'Succesdfully updated details.'
            });
        } 
    });
});

module.exports= router;