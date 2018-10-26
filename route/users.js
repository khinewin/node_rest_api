const express=require('express')
const route=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcrypt-nodejs');
const User=require('../model/User');
const jwt=require('jsonwebtoken');

route.post('/login',(req, res, next)=>{
    User.find({name: req.body.name}).exec().then(result=>{
        if(result.length <=0){
            res.json({
                message : "Authentication failed with username"
            })
        }

        bcrypt.compare(req.body.password, result[0].password, function (err, passwordTrue) {
            if(passwordTrue){
                let token=jwt.sign(
                    {name:result[0].name, email: result[0].email,_id:result[0]._id},
                    "password",
                    {
                        expiresIn: "1h"
                    }
                )
                res.json({
                    message : "Login success",
                    token :token

                })
            }
            else{
                res.json({
                    message : "Authentication failed, with password"
                })
            }
        })

    }).catch(err=>{
        res.json(err)
    })
});


route.post('/signup', (req, res, next)=>{
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        let userInfo={
            _id: new mongoose.Types.ObjectId,
            name :req.body.name,
            email:req.body.email,
            password : hash
        }
        User.find({name : req.body.name}).exec().then(inUse=>{
            if(inUse.length >=1){
                res.status(422).json({
                    message : "The username is already exists"
                });
            }else{
                User.find({email: req.body.email}).exec().then(emailHas=>{
                    if(emailHas.length >=1){
                        res.json({
                            message : "The selected email is inuse."
                        })
                    }else{
                        let user=new User(userInfo);
                        user.save().then(result=>{
                            res.json({
                                message : result
                            })
                        }).catch(error=>{
                            res.json(error)
                        })
                    }
                }).catch(emailErr=>{
                    res.json(emailErr);
                })
            }
        }).catch(err=>{
            res.json(err)
        });

    });

});

module.exports=route;