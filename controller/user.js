const Users = require("../model/user");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const User = require("../model/user");

const signUpUser = async(req, res)=>{
    try {
        const { name, username, email, password, agreeToTerms, rememberMe } = req.body;
    
        // Validate agreeToTerms
        if (!agreeToTerms) {
          return res.status(400).json({ message: 'You must agree to the terms and conditions.' });
        }
    
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use.' });
        }
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = new User({
          name,
          username,
          email,
          password: hashedPassword,
          agreeToTerms,
          rememberMe,
        });
    
        await newUser.save();
    
        res.status(201).json({ message: 'User created successfully!', user: newUser });
      } catch (error) {
        res.status(500).json({ message: 'Error signing up user.', error: error.message });
      }
}

const signInUser = async(req, res)=>{
    try {
        const { email, password } = req.body;
    
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials.' });
        }
    
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials.' });
        }
    
        // Generate JWT
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', {
          expiresIn: user.rememberMe ? '7d' : '1h',
        });
    
        res.status(200).json({ message: 'Login successful!', token, user });
      } catch (error) {
        res.status(500).json({ message: 'Error logging in user.', error: error.message });
      }
}

module.exports = {
    signUpUser,
    signInUser,
}