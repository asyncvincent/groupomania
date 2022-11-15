const router = require('express').Router();
const postsController = require('../controllers/posts.controller');
const image = require('../middleware/imageChecker');
const tokenChecker = require('../middleware/tokenChecker');

// @route   GET api/v1/posts
// @desc    Return all posts
// @access  Private
router.get('/', tokenChecker, postsController.getAllPosts);

// @route   GET api/v1/posts/:id
// @desc    Return post by id
// @access  Private
router.get('/:id', tokenChecker, postsController.getPostById);

// @route   POST api/v1/posts/create
// @desc    Create post
// @access  Private
router.post('/create', image, tokenChecker, postsController.createPost);

// @route   POST api/v1/posts/update/:id
// @desc    Update post
// @access  Private
router.put('/update/:id', image, tokenChecker, postsController.updatePost);

// @route   POST api/v1/posts/delete/:id
// @desc    Delete post
// @access  Private
router.delete('/delete/:id', tokenChecker, postsController.deletePost);

// @route   POST api/v1/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', tokenChecker, postsController.likePost);

module.exports = router;
