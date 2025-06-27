const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Plan = db.sequelize.define('Plan', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      billing_type: {
        type: DataTypes.ENUM('monthly', 'yearly'),
        allowNull: false
      },
      features: {
        type: DataTypes.JSON, //set of features
        allowNull: false
      },
      is_featured: {
        type: DataTypes.BOOLEAN, //badge
        defaultValue: false
      }
    });


db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Database Synchronized with model...");
  });

module.exports = { Plan };