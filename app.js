const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const user = require('./router/user')

const record = require('./model/record')
const users = require('./model/user')
const sequelize = require('./util/database')
const reset = require('./model/passResetReq')

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')));

app.use(user)
app.use('/main',user)

//Association
users.hasMany(record)
record.belongsTo(users)
users.hasMany(reset)
reset.belongsTo(users)

sequelize
    // .sync({force:true})
    // .sync({alter:true})
    .sync()
    .then(app.listen(3000))
    .catch(err=>{
        console.log(err)
    })
