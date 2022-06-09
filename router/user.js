const express = require('express')
const route = express.Router()
const user = require('../controller/user')
const app = require('../controller/app')
const jwt = require('jsonwebtoken');
const users = require('../model/user.js')

const authentication = (req,res,next)=>{
    const token = req.header('Authorization');
    console.log('This is th Token',token)
    if (token){
        const userId = jwt.verify(token,process.env.TOKEN_SECRET);
        users.findByPk(userId.username)
        .then(user =>{
            req.user = user
            return next()
        })
        .catch(err =>{
            throw new Error(err);
        })
    }
    else{
        res.redirect('/sign-in')
    }
}

const premium_authentication = async (req,res,next)=>{
    const token = req.header('Authorization');
    const user = await jwt.verify(token,process.env.TOKEN_SECRET)
    req.premium = user.premium
    next()
}

route.get('/sign-up', user.signup)
route.post('/signUp-detail',user.detail)
route.get('/sign-in',user.sign_in)
route.post('/logged-in',user.logged_in)
route.get('/password',user.password)
route.post('/password/resetpassword/', user.reset)
route.get('/password/resetpassword/:reset_request',user.resetRequest)

route.get('/home', app.home)

//tracker
route.post('/tracker/addexpense',authentication ,app.add)

route.get('/premium',premium_authentication, (req,res,next)=>{res.json(req.premium)})

route.post('/buy-membership',app.membership)

route.get('/order',app.order)

route.get('/table',app.table)

route.get('/leaderboard', app.leaderboard)

route.get('/dashboard', app.dashboard)

route.post('/pay/verify', app.verify)

//table
route.get('/daily',authentication,app.daily)

// route.get('/monthly',app.monthly)

// route.get('/yearly', app.yearly)

module.exports = route