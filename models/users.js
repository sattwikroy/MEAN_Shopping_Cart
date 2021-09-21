const bcrypt = require('bcryptjs');
const { Double } = require('bson');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/database');

// AddreessSchema
const AddressSchema = new mongoose.Schema({
  line1: {
    type: String,
    required: true
  },
  line2: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  }
},{ _id : false });

// Use Schema
const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    address: {
      type: [AddressSchema]
    }
  });

  const User = module.exports = mongoose.model('User', UserSchema );

  module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
  }

  module.exports.getUserByEmail = function(email, callback){
    const query = {email : email}
    User.findOne(query, callback);
  }
 
  module.exports.addUser = function (newUser, callback){
    bcrypt.genSalt(10, (err, salt)=> {
      bcrypt.hash(newUser.password, salt, (err, hash)=>{
        if(err){
          throw err;
        }
        newUser.password = hash;
        newUser.save(callback);
      })
    })
  }
  module.exports.editUser = function (UserToUpdate,callback){
    const query = {_id: UserToUpdate.id};
    const option = {new: true};
    User.findOneAndUpdate(query,UserToUpdate,option,callback);
  }
  
  module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) {
      throw err;
    }
    callback(null, isMatch);
  })
}