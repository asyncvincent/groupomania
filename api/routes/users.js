const router = require('express').Router();
const userController = require('../controllers/users.controller');
const avatar = require('../middleware/avatarChecker');
const tokenChecker = require('../middleware/tokenChecker');

// @route   GET api/v1/users/:id
// @desc    Return user by id
// @access  Private
router.get('/:username', tokenChecker, userController.getUserByUsername);

// @route   POST api/v1/users/update
// @desc    Update user
// @access  Private
router.put('/update', tokenChecker, avatar, userController.updateUser);

// @route   POST api/v1/users/delete
// @desc    Delete user
// @access  Private
router.delete('/delete/:id', tokenChecker, userController.deleteUser);

module.exports = router;
