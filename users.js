const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
      },

    email:{ 
    type: DataTypes.STRING,
     allowNull: false,
      unique: true },

    password: 
    { type: DataTypes.STRING,
     allowNull: false },

    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' }
});

 db.sequelize.sync({alter: true})
      .then(() => {
        console.log("Database Synchronized with model...");
      });
    
module.exports = { User };