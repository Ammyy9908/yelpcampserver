const router = require('express').Router();
const User = require('../models/User');
const bcrypt= require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Camp = require('../models/Camp');

dotenv.config();


const verifyUser = async (req,res,next)=>{
    
        const token = req.header('Authorization');
        
        if(!token){
            return res.status(401).json({msg:'No token, authorization denied'});
        }

        try{
            const decoded = await jwt.verify(token, "topsecret");
            
            req.user = decoded;
            next();
        }
        catch(err){
            return res.status(401).json({msg:'Token is not valid'});
        }
    
}


router.post('/camp/new',verifyUser,async (req,res)=>{
    const user = req.user;
        const {image,title,description,price,location} = req.body;
        

        const camp = await Camp.findOne({title});
        if(camp){
            return res.status(200).json({error:'Camp already exists with this title'});
        }

        const newCamp = new Camp({
            image,
            title,
            description,
            price,
            location,
            author:user._id
        });

        newCamp.save().then(async (camp)=>{
            if(camp){
                res.status(200).json({camp});
            }
        }).catch((e)=>{
            res.status(500).json({error:e});
        })

}).get('/camps',async (req,res)=>{
    const camps = await Camp.find();
    res.status(200).json({camps});
}).get('/camp/:id',async (req,res)=>{

    const camp = await Camp.findById(req.params.id);
    res.status(200).json({camp});
}).get('/author/:uid',async (req,res)=>{
    
    const user = await User.findOne({_id:req.params.uid});
    
    res.status(200).send(user.username);
})



module.exports = router;