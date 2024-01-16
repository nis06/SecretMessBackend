
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Error messages
const signUpErrorMessage = "Unable to sign up. Please try again later.";
const loginErrorMessage = "Unable to log in. Please try again later.";
const genericErrorMessage = "Something went wrong. Please try again later.";

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

   
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,

    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill in the required details",
      });
    }

  
    const user = await User.findOne({ email });

  
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not a registered user",
      });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
     
      const payload = {
        email: user.email,
        id: user._id,
      };


      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d", 
      });

     
      const userWithoutPassword = { ...user.toObject(), password: undefined };

      
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        user: userWithoutPassword,
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password does not match",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: loginErrorMessage,
    });
  }
};

exports.newpass = async (req, res) => {
  try {
    const { email, newpassword, confirmPassword } = req.body;

 
    if (!email || !newpassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Fill in the required details",
      });
    }

    const user = await User.findOne({ email });

    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not a registered user",
      });
    }

    if (newpassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    
    const hashedPassword = await bcrypt.hash(newpassword, 10);

   
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

