const express = require('express');
const router = express.Router();

const User = require('./../models/User');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

router.post('/signup',async (req,res)=>{
    try{
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();
        console.log('Data Saved Successfully!');

        const payload = {           //payloads are the fields that should be added to the generated tokens.
            id:response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token is:=', token);
        res.status(200).json({response:response,token:token});
        if(!response){
            console.log('Empty data cannot be saved!');
            res.status(500).json({error:'Empty data cannot be saved'});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})
router.post('/login',async(req,res) => {
    try{
        //extract username and password from request body
        const {aadharCardNumber,password} = req.body;

        //find the user by username
        const user = await User.findOne({aadharCardNumber:aadharCardNumber});

        //if username does not exist or password does not match return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:'Invalid username or password'});
        }
        //generate Token
        const payload = {
            id:user.id
        }
        const token = generateToken(payload);
        //return token as response
        res.json({token});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

router.get('/profile',jwtAuthMiddleware,async(req,res) => {
    try{
        const userData = req.user;      //req.user from jwt.js decoded token to Extract id from token
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({message:"you had successfully entered into the profile"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'Internal server Error'});
    }
})

router.put('/profile/password',jwtAuthMiddleware,async (req,res)=>{    
    try{
        const userId = req.user;    //req.user from jwt.js decoded token to Extract id from token
        const {currentPassword, newPassword} = req.body;   //extract current and new password from request body

        //find the user by userId
        const user = await User.findById(req.user.id);
       //if username does not exist or password does not match return error
        if(!user || !(await user.comparePassword(currentPassword))){
            return res.status(401).json({error:'Invalid username or password'});
        }
        
        //update the user's password
        userId.password = newPassword; 

        await user.save();
        console.log('Password Updated Successfully!');
        res.status(200).json({message:'Password Updated Successfully!'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

module.exports = router;