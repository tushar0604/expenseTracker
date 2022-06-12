const path = require('path')
const bcrypt = require('bcryptjs')
const users = require('../model/user.js')
const record = require('../model/record')
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay')
const AWS = require('aws-sdk')

function uploadtoS3(data,filename){
    const BUCKET_NAME = 'userexpense'
    const IAM_USER_KEY = 'process.env.IAMUser_key'
    const IAM_USER_SECRET = 'process.env.IAMUser_Secret_key' 

    let s3bucket = new AWS.S3({
        accesskeyid:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        Bucket:BUCKET_NAME
    })

    var params = {
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'          //Make file publically accesable
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) =>{
            if(err){
                console.log('Something went wrong', err)
                reject(err)
            }else{
                console.log('success', s3response);
                resolve(s3response.Location)
            }
        })       
    })
}

var instance = new Razorpay({ 
    key_id: process.env.Key_Id, 
    key_secret: process.env.Key_Secret 
})

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '18000s' });
  }

exports.home = (req,res,next)=>{
    res.sendFile(path.join(path.dirname(
        process.mainModule.filename
    ),'view','home.html'))
}

exports.add = (req,res,next)=>{
    const {amount,category,descrip} = req.body
    console.log('This is single user ',req.user)
    req.user.createRecord({expense:amount,category:category,description:descrip})
    .then(expense =>{
        return res.status(201).json({expense,success: true})
    })
    .catch(err => {
        res.status(402).json({error:err,success:true})
    })
}

exports.membership = (req,res,next)=>{
    instance.orders.create({ 
        amount: 5000,  
        currency: "INR",  
        receipt: "receipt#1",  
        payment_capture: '1',
        notes: {
            key1: "value3",    
            key2: "value2"  
        }
    })
    .then(response =>{
        console.log('This is the response of razer pay',response)
        res.json(response)
    })
}

exports.order = (req,res,next) =>{
    res.sendFile(path.join(path.dirname(
        process.mainModule.filename
    ),'view','checkout.html'))
}

exports.dashboard = (req,res,next) =>{
    res.sendFile(path.join(path.dirname(
        process.mainModule.filename
    ),'view','leaderboard.html'))
}

exports.leaderboard = (req,res,next) =>{
    var check1 = new Array()
    users.findAll()
    .then(Users =>{
        let length = Users.length
        Users.forEach((user,idx) => {
            let obj = {
                name:user.name,
                exp: 0
            }
            user.getRecords()
            .then(records =>{
                records.forEach(record =>{
                    obj.exp = obj.exp + record.expense
                })
                check1.push(obj)
                if (idx==length-1){
                    res.json(check1)
                }
            })
        });
    })
}

exports.verify = (req,res,next) =>{
    const Body = req.body.order_id + '|' + req.body.payment_id
    const isValid = Razorpay.validateWebhookSignature(
        Body, req.body.sign, process.env.Key_Secret);
    console.log(isValid)
    if(isValid){
        res.json({success:true})
    }else{
        res.status(400).json({err:"transaction failed"})
    }
}

exports.table = (req,res,next) =>{
    res.sendFile(path.join(path.dirname(
        process.mainModule.filename
    ),'view','table.html'))
}

exports.daily = async (req,res,next) =>{
    let id = req.user.id
    let page
    if (!req.query.page){
        page = 1
    }else{
        page = req.query.page
    }
    let view = +req.query.view
    let off = +(page-1)*view
    const total = await req.user.countRecords()
    // console.log(Object.keys(req.user.__proto__))
    await req.user.getRecords({
        offset:off,
        limit:view
    })
    .then(records =>{
        let daily_list = []
        records.forEach(record =>{
            daily_list.push(record)
        })
        res.json({list:daily_list,total:total})
    })
}

exports.download = async (req,res) =>{
    if (req.premium){
        const userId = req.user.id
        const expense = await req.user.getRecords()
        const string_expense = JSON.stringify(expense)
        const filename = `expense${userId}/${new Date()}.txt`
        const fileurl = uploadtoS3(string_expense,filename)
        res.status(200).json({success:true,fileurl})
    }else{
        res.json({err:"You are not Subscribe to Premium membership"})
    }
}