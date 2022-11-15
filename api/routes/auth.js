const router = require('express').Router();
const avatar = require('../middleware/avatarChecker');
const authController = require('../controllers/auth.controller');

// @route   POST api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   POST api/v1/auth/register
// @desc    Register user
// @access  Public
router.post('/register', avatar, authController.register);

// @route   POST api/v1/auth/refresh
// @desc    Refresh token
// @access  Public
router.post('/refresh', authController.refreshToken);

module.exports = router;
