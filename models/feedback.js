const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Feedback = db.sequelize.define('Feedback', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    });

    db.sequelize.sync({ alter: true })
      .then(() => {
        console.log("Database Synchronized with model...");
      });
    
    
    module.exports = { Feedback };
