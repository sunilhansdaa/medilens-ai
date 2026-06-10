const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is missing in environment variables');
    error.statusCode = 500;
    throw error;
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const sendAuthResponse = (res, statusCode, user, message) => {
  const token = createToken(user._id);
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      preferences: user.preferences || {
        language: 'English',
        theme: 'Light'
      }
    }
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }
    const user = await User.create({ name, email, password });
    sendAuthResponse(res, 201, user, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    sendAuthResponse(res, 200, user, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const getProfile = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
      preferences: req.user.preferences || { language: 'English', theme: 'Light' }
    }
  });
};

const updateSettings = async (req, res, next) => {
  try {
    const language = req.body.language === 'Hindi' ? 'Hindi' : 'English';
    const theme = req.body.theme === 'Dark' ? 'Dark' : 'Light';
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: { language, theme } },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({
      success: true,
      message: 'Settings updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateSettings };