const userModel = require('../models/auth.schema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function register(req,res){

    const {username,email,password,profile} = req.body
    
    if(!username || !email || !password){
       return res.status(401).json({message:"All fields are required"});
    }
    const isUserExists = await userModel.findOne({email});

    if(isUserExists){
       return res.status(401).json({message:"User already exists"});
    }

     const hash = await bcrypt.hash(password,10);
    const user = await userModel.create(
    {
        username,
        email,
        password:hash
    }
    );

    const token = await jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.cookie('token',token);

    res.status(200).json({message:"registration successful",user});
}


async function login(req,res){
    const {email,password} = req.body
    if(!email || !password){
        return res.status(401).json({message:"All fields are required"});
    }
    const isUserExists = await userModel.findOne({email});
    if(!isUserExists){
        return res.status(401).json({message:"User does not exists"});
    }
    const pass = await bcrypt.compare(password,isUserExists.password);

    if(!pass){
        res.status(401).json({message:"invalid email or password"})
    }
    const token = await jwt.sign({id:isUserExists._id},process.env.JWT_SECRET)
    res.cookie('token',token);
    res.status(200).json({message:"Login successful",isUserExists});


}

function logout(req,res){
    res.clearCookie('token');
    res.status(200).json({message:"logged out successfully"})
}

module.exports ={register,login,logout}