'use strict';
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    title: DataTypes.STRING,
    writer: DataTypes.STRING
  }, {});
  post.associate = function(models) {
    // associations can be defined here
  };
  return post;
};