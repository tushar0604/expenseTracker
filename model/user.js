const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    phone_no:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    premium:{
        type:Sequelize.BOOLEAN
    },
    order_id:{
        type:Sequelize.STRING
    }
});

module.exports = User