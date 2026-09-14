const { body } = require('express-validator');
const { User } = require('../models');

const registerRules = () => {
  return [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail().custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject('E-mail already in use');
      }
    }),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ];
};

const loginRules = () => {
  return [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ];
};

module.exports = {
  registerRules,
  loginRules,
};
