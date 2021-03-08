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
});
db.query("USE sql6397053",(err,results)=>{
    if(err)
    console.log(err);
});
db.query("CREATE TABLE IF NOT EXISTS users ( id int NOT NULL AUTO_INCREMENT, name VARCHAR(50) NOT NULL , email VARCHAR(50) NOT NULL , password VARCHAR(100) NOT NULL, CONSTRAINT users_pk PRIMARY KEY (id))",(err,results)=>{
    if(err)
    console.log(err);
});
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));
const PORT= process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("listening");

});
