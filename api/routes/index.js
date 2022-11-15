require('dotenv').config();
const router = require('express').Router();
const usersRouter = require('./users');
const authRouter = require('./auth');
const postsRouter = require('./posts');

// @route   GET api/v1/
// @desc    Get all routes
// @access  Public
router.get('/', (req, res) => {
    res.json({
        status: 'open',
        version: process.env.API_VERSION
    });
});

// @route   api/v1/users
// @access  Private
router.use('/users', usersRouter);

// @route   api/v1/auth
// @access  Public
router.use('/auth', authRouter);

// @route   api/v1/posts
// @access  Private
router.use('/posts', postsRouter);

module.exports = router;