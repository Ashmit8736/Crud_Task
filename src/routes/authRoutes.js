const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidator');
const { validate } = require('../middleware/validateMiddleware');

router.post('/register', registerRules(), validate, registerUser);
router.post('/login', loginRules(), validate, loginUser);

module.exports = router;
