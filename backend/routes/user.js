const express = require('express');
const bcrypt = require('bcrypt');
const UserRouter = express.Router();
const { User } = require('../models/User.js');
const jwt = require('jsonwebtoken');
var nodemail = require('nodemailer');
require('dotenv').config();

UserRouter.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        return res.json({status: true, message: "Email already exists!!"});
    }

    const hashpwd = await bcrypt.hash(password,10);
    const newUser = new User({
        username,
        email,
        password: hashpwd,
    });

    await newUser.save();
    return res.json({status: true, message: "User successfully created!!"});
});

UserRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.json({message: "User is not registered!!"});
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        return res.json({message: "Password is incorrect!!"});
    }

    const token = jwt.sign({username: user.username}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
    res.cookie('token', token, {httpOnly:true, maxAge: 360000});
    
    return res.json({status: true, message: "Login Successful!!"});
});

UserRouter.post('/forgot-password', async (req, res) => {
    const {email} = req.body;
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.json({message: "User is not registered!!"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5m'});

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'youremail@gmail.com', //change this to actual email
              pass: 'yourpassword' //change this to email password
            }
        });
        const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
        var mailOptions = {
            from: 'youremail@gmail.com', //change this to actual email
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:3000/resetPassword/${encodedToken}`,
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.json({message: "error sending email"});
            } else {
                return res.json({status:true,  message: "email sent"});
            }
        });
    } catch(error) {

    }
});

UserRouter.post('/reset-password/:token', async (req, res) => {
    const {token} = req.params.token;//from here the implementation of reset-password should continue
    const {password} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const id = decoded.id;
        const hashpwd = bcrypt.hash(password, 10);
        await User.findByIdAndUpdate({_id: id, }, {password: hashpwd});
        return res.json({status: true, message: "Update Password"})
    } catch(err) {
        return res.json({message: "invalid token"});
    } 
});

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({status: false, message: "no token"});
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch(err) {
        return res.json(err)
    }
    
}

UserRouter.get('/verify', verifyUser, (req, res) => {
    return res.json({status: true, message: "authorised"});
});

UserRouter.get('/logout', (req,res) => {
    res.clearCookie('token');
    return res.json({status: true})
});

module.exports = {
    UserRouter,
};