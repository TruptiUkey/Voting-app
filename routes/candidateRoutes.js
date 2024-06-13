const express = require('express');
const router = express.Router();

const Candidate = require('./../models/candidate');
const {jwtAuthMiddleware} = require('./../jwt');
const User = require('../models/User');

//function to check the entered user is admin or not
const checkAdminRole = async (userId) => {
    try{
        const user = await User.findById(userId);
        if(user.role == 'admin')
            return true;
    }catch(err){
        return false;
    }
}

router.post('/',jwtAuthMiddleware,async (req,res)=>{
    try{
        if(!await checkAdminRole(req.User.id)){
            return res.status(403).json({message:'user does not have admin role'});
        }
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log('Data Saved Successfully!');

        res.status(200).json({response});
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

router.put('/:candidateId',jwtAuthMiddleware,async (req,res)=>{     //jwtmddleware means require token to access this endpoint
    try{
        if(!checkAdminRole(req.User.id))
            return res.status(403).json({message:'user does not have admin role'});

        const candidateId = req.params.candidateId;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData,{
            new: true,  //return updated documents
            runValidators: true    //run mongoose validators 
    });

        if(!response){
            res.status(404).json({error:'Candidate not found'});
        }
        console.log('Candidate data updated');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})


router.delete('/:candidateId',jwtAuthMiddleware,async (req,res)=>{     //jwtmddleware means require token to access this endpoint
    try{
        if(!checkAdminRole(req.User.id))
            return res.status(403).json({message:'user does not have admin role'});

        const candidateId = req.params.candidateId;
        const response = await Candidate.findByIdAndDelete(candidateId);

        if(!response){
            res.status(404).json({error:'Candidate not found'});
        }
        console.log('Candidate data deleted');
        res.status(200).json({message:'Candidate deleted successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//Let's start voting
router.post('/vote/:candidateId',jwtAuthMiddleware,async(req,res) =>{
    //no admin can vote
    //user can vote only once
    candidateId = req.params.candidateId;
    userId = req.User.id;
    try{
        //Find the candidate document with the specified candidateId
        const candidate = await Candidate.findById(candidateId);
        if(!candidate)
            return res.status(404).json({message:"candidate not found"});

        const user = await User.findById(userId);
        if(!user)
            return res.status(404).json({message:"user not found"});

        if(user.isVoted)
            res.status(400).json({message:"You have already voted for a candidate"});

        if(user.role == 'admin')
            res.status(403).json({message:"Admin is not allowed"});

        //update the candidate document to record the vote
        candidate.votes.push({User: userId});
        candidate.voteCount++ ;
        await Candidate.save();

        //update the user document
        User.isVoted = true;
        await User.save();

        res.status(200).json({message:"Vote recoeded successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//vote Count
router.get('/vote/count',async(req,res)=>{
    try{
        //find all candidates and sort them by vote countin descending order
        
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //map the candidates to only return their name and voteCount
        const voteRecord = Candidate.map((data)=>{
            return {
                party:data.party,
                count:data.voteCount
            }
        })
        res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

module.exports = router;