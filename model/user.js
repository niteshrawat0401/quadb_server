const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  name: { 
    type: String,
     required: false
     },
  username: { 
    type: String,
     required: false,
      unique: true
     },
  email: { 
    type: String, 
    required: false, 
    unique: true },
  password: { 
    type: String, 
    required: false 
  },
  agreeToTerms: { 
    type: Boolean, 
    required: false }, 
  rememberMe: { 
    type: Boolean, 
    default: false },
  createdAt: { 
    type: Date, 
    default: 
    Date.now },
});

const User = model('User', userSchema);
module.exports = User;