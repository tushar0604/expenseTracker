const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const passwordReset = sequelize.define('passReset',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    request:{
        type:Sequelize.STRING,
        allowNull:false
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
    }
});

module.exports = passwordReset