const mysql=require('mysql');
const express=require('express');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const validator=require('email-validator');
const nodemailer=require('nodemailer');
require("dotenv").config();

const app=express();

  
const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE,
});
var a,b,c,d;
var OTP;
var STRINGOTP;
exports.login=async (req,res)=>{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).render('login',{
                message : 'Please enter email and Password' 
            })
        }
        
    db.query("SELECT * FROM users WHERE email=?",[email], async (error,results)=>{
        if(error)
        {console.log(error);}
        if(results.length==0||((results.length>0)&&(!(await bcrypt.compare(password,results[0].password)))))
        {
            return res.status(400).render('login',{message: 'Incorrect Email or Password'});
        }
        else{
            /*const id=results[0].id;
            const token=jwt.sign({ id }, process.eventNames.JWT_SECRET,{
                expiresIn:processenv.JWT_EXPIRE_IN

            });
            const cockieOptions={
                expires:new Date(
                    Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
                ),
                httponly: true,
            }
            res.cockie('jwt',token,cookieOptions);
            res.status(200).redirect("/")*/
            return res.status(200).render('login',{message : 'Hi' +results[0].name + 'You have been successfully logged in'});
        }

    });
}

exports.forgotpassword =async (req,res)=>{
    OTP=Math.floor(Math.random() * (1000000 - 100000) ) + 100000;
    STRINGOTP=OTP.toString();
    db.query("SELECT email FROM users WHERE email =?", [req.body.email],async(error,results)=>{
        if(error){
            console.log(error);
        }
        else{
        if((results.length)==0){
            return res.status(400).render('forgotpassword',{message: 'You havenot Registered yet'});
        }
        }
    });
    if(validator.validate(req.body.email))
    {
        let transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        });
        
        let mailOptions={
            from:process.env.EMAIL,
            to:req.body.email,
            subject:"Resetting Password",
            text:"Your 6 digit OTP is "+ STRINGOTP,
        };

        transporter.sendMail(mailOptions,(err,data)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                d=req.body.email;
                res.redirect("/validationforresetpassword");
            }
        });
    }
    else
    {
        return res.status(400).render('forgotpassword',{message : 'Invalid Email'});
    }
}

exports.resetpassword=async (req,res)=>{
    const { password,passwordCheck }=req.body;
    if(!password||!passwordCheck)
    return res.status(400).render('resetpassword',{message: 'Please fill the details'});
    if(password==passwordCheck)
    {
        db.query("SELECT email FROM users WHERE email =?", [d],async(error,results)=>{
            if(error){
                console.log(error);
            }
            else{
            if((results.length)==0){
                return res.status(400).render('resetpassword',{message: 'You havenot Registered yet'});
            }else{
                let hashedPassword=await bcrypt.hash(password,8);
            
                db.query("UPDATE users SET password='"+hashedPassword+"' WHERE email=?",[d],async (error,results)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        return res.status(200).render('resetpassword',{message: 'Password Successfully Updated'});
                    }
                });
            }
            }
        });
    }
    else
    {
        return res.status(400).render('resetpassword',{message : 'Password and Confirm Password are not matched'});
    }
}

exports.validationforresetpassword =async (req,res)=>{
    const check=req.body.otp;
    if(check==STRINGOTP)
    {
        res.redirect("/resetpassword");
    }
    else
    {
        return res.status(400).render('validationforresetpassword',{message: 'OTP is wrong'});
    }
}
exports.validate =async (req,res)=>{
    const check=req.body.otp;
    
    if(check==STRINGOTP)
    {
        let hashedPassword=await bcrypt.hash(c,8);
                db.query( "INSERT INTO users SET ?",{ name: a, email : b, password : hashedPassword},(error,results)=>{
                    if(error){
                    console.log(error);
                }
                else{
                    return res.status(200).render('validate',{message: 'The User is Registered'}); 
                }
                });
    }
    else
    {
        return res.status(400).render('validate',{message: 'OTP is wrong'});
    }
}


exports.register =function(req,res){
    OTP=Math.floor(Math.random() * (1000000 - 100000) ) + 100000;
    STRINGOTP=OTP.toString();
    const {name,email,password,passwordCheck} =req.body;
    console.log(req.body);
    db.query("SELECT email FROM users WHERE email =?", [email],async(error,results)=>{
        if(error){
            console.log(error);
        }
        else{
        if((results.length)>0){
            return res.status(400).render('register',{message: 'The email have been already taken'});
        }else if(password!==passwordCheck){
            return res.status(400).render('register',{message: 'Passwords didnot match'});
        }
        else {

            if(validator.validate(email))
            {
                a=name;
                b=email;
                c=password;
                let transporter=nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:process.env.EMAIL,
                        pass:process.env.PASSWORD
                    }
                });
        
                let mailOptions={
                    from:process.env.EMAIL,
                    to:req.body.email,
                    subject:"Email Validation",
                    text:"Your 6 digit OTP is "+ STRINGOTP,
                };
        
                transporter.sendMail(mailOptions,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        d=req.body.email;
                        res.redirect("/validate");
                    }
                });
            }
            else
            {
                return res.status(400).render('register',{message: 'Invalid Email'});
            }
        }

    }
    });
}
