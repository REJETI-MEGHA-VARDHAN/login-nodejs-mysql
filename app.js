const express=require("express");
const mysql=require('mysql');
const app=express();
const dotenv=require("dotenv");
const path=require('path');
const cookieparser=require('cookie-parser');
dotenv.config({path:"./.env"});

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
})

const publicDirectory=path.join(__dirname,'./public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended:false}));

app.use(express.json());
app.use(cookieparser());

app.set("view engine","hbs");
db.connect((error)=>{
    if(error)
    console.log(error);
    else
    {
        db.query("CREATE DATABASE IF NOT EXISTS mydb",(err,results)=>{
            if(err)
            console.log(err);
        });
    }
});
db.query("USE mydb",(err,results)=>{
    if(err)
    console.log(err);
});
db.query("CREATE TABLE IF NOT EXISTS users ( id int NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL , email VARCHAR(50) NOT NULL , password VARCHAR(100) NOT NULL, CONSTRAINT users_pk PRIMARY KEY (id))",(err,results)=>{
    if(err)
    console.log(err);
});
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(5000,()=>{
    console.log("listening");

});