const express = require('express');
const router = express.Router();
const { signUp, login,newpass } = require('../controllers/Auth');

// Middleware for handling async route functions
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Login route
router.post('/login', asyncHandler(async (req, res) => {
  const result = await login(req, res);
  res.json(result);
}));

// Signup route
router.post('/signup', asyncHandler(async (req, res) => {
  const result = await signUp(req, res);
  res.json(result);
}));

// paswword recovery route
router.post('/recoverpass', asyncHandler(async (req, res) => {
    const result = await newpass(req, res);
    res.json(result);
  }));


module.exports = router;
