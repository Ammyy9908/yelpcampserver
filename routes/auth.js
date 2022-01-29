const router = require('express').Router();
const User = require('../models/User');
const bcrypt= require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();


const verifyUser = async (req,res,next)=>{
    
        const token = req.header('Authorization');
        
        if(!token){
            return res.status(401).json({msg:'No token, authorization denied'});
        }

        try{
            const decoded = await jwt.verify("topsecret");
            
            req.user = decoded;
            next();
        }
        catch(err){
            return res.status(401).json({msg:'Token is not valid'});
        }
    
}


router.get('/user',verifyUser,async (req,res)=>{
   
    const user = req.user;
    const person = await User.findOne({_id:user._id});
    res.status(200).send({name:person.username});
})
.post('/new',async (req,res)=>{
    const {username,password} = req.body;
    
    const user = await User.findOne({username});
    if(user){
        return res.status(200).json({error:'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({
        username,
        password:hashedPassword
    })

    newUser.save().then(async (user)=>{
        if(user){
            const token =  await  jwt.sign({_id:user._id},"topsecret");
            res.status(200).json({token});
        }
    })

}).post('/login',async (req,res)=>{
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.status(200).send({error:"User not found"});
    }

    // match password

    const isvalid = await bcrypt.compare(password,user.password);
    if(!isvalid){
        return res.status(200).send({error:"Invalid username & password"});
    }

    // create token

    const token = await jwt.sign({_id:user._id},"topsecret");
    res.status(200).json({token});
})



module.exports = router;