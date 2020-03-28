'use strict';
module.exports = (sequelize, DataTypes) => {
  var user2 = sequelize.define('user2', {
    user_id  : {
      type:  DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },{
    classMethods: {
      associate: function(models){
        // associateions can be defined here
      }
    }
  });
  return user2;
};