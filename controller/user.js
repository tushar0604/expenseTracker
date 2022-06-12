const path = require('path')
const bcrypt = require('bcryptjs')
const user = require('../model/user')
const resetReq = require('../model/passResetReq')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '18000s' });
  }

exports.signup = (req,res,next) => {
    res.sendFile(path.join(path.dirname(process.mainModule.filename),
    'view','sign up.html'))
}

exports.sign_in = (req,res,next) => {
    res.sendFile(path.join(path.dirname(process.mainModule.filename),
    'view','login.html'))
}

exports.detail = (req,res,next) => {
    bcrypt.hash(req.body.password,12)
    .then(hash_pass => {
        user.create({
            name:req.body.name,
            email:req.body.email,
            phone_no:req.body.phone_no,
            password:hash_pass
        })
        res.redirect('/sign-up')
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.password = (req,res,next) => {
    res.sendFile(path.join(path.dirname(process.mainModule.filename),
    'view','forgotpass.html'))
}

exports.logged_in = (req,res,next) =>{
    user.findOne({
        where:{
            email:req.body.email
        }
    })
    .then(user => {
        if (!user){
            return res.status(400).json({status:"The Email address doesn't exist."})
        }else {
            console.log(user.id)
            bcrypt.compare(req.body.password,user.password)
            .then(result =>{
                console.log('This is result', result)
                if (result){
                    const token = generateAccessToken({username:user.id,premium:user.premium});
                    console.log('This is token', token)
                    res.status(200).json({token:token,redirect:'/main/home'});
                } else{
                    res.status(400).json({status:'Incorrect Password'})
                }
            })
        }
    })
}

//reset password
exports.reset = async (req,res,next) =>{
    const id = req.query.id
    if(!id){
        const email = req.body.email
        user.findOne({where:{email:email}})
        .then(user=>{
            const id = uuidv4()
            req.user = user
            user.createPassReset({request:id,status:true})
            .then(
                res.json({id:id})
            )
        })
    }
    else{
        const check = await resetReq.findOne({
            where:{
                request:id,
                status:true
            }
        })
        if(check===null){
            res.json({error:'link got expire'})
        }
        else{
            await resetReq.update({status:false},{
                where:{
                    request:id
                }
            }).catch(err=>console.log(err))
            await bcrypt.hash(req.body.password,12)
            .then(hash_pass => {
                user.update({password:hash_pass},{
                    where:{email:req.body.email}
                    }
                )
                res.json({redirect:'/sign-in'})
            })
            .catch(err=>{console.log(err)})    
        }
    }
}

exports.resetRequest = (req,res,next) =>{
    const {id} = req.params.reset_request
    res.sendFile(path.join(path.dirname(process.mainModule.filename),
    'view','file.html'))
}
