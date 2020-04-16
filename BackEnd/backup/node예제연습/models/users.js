module.exports = function(sequelize, DataTypes){
    let user = sequelize.define("User", {   //스키마정의
        userID: {
            filed: "user_id",
            type: DataTypes.STRING(50),
            unique : true,
            allowNull: false
        },
        passwword: {
            field: "password",
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {//테이블 정의
        underscored : true,
        freezeTableName : true,
        tableName: "user"
    });
    return user;
}