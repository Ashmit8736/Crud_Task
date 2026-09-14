const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      // Generate custom ID like ashm01
      let prefix = user.name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toLowerCase().padEnd(4, 'a');
      const { Op } = require('sequelize');
      const lastUser = await user.constructor.findOne({
        where: { id: { [Op.like]: `${prefix}%` } },
        order: [['createdAt', 'DESC']]
      });
      let nextNum = 1;
      if (lastUser) {
        const numPart = lastUser.id.replace(prefix, '');
        const parsed = parseInt(numPart, 10);
        if (!isNaN(parsed)) nextNum = parsed + 1;
      }
      user.id = `${prefix}${String(nextNum).padStart(2, '0')}`;

      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
