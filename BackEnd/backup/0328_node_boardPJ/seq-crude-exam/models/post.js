'use strict';
module.exports = (sequelize, DataTypes) => {
  var post = sequelize.define('post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  return post;
};