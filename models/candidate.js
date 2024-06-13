const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
const bcrypt = require('bcrypt');

const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    party:{
        type:String,
        required:true
    },
    votes:  //here we will create array of objects
        [
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User',  //this will come from user table
                    required:true
                },
                votedAt:{
                    type:Date,  //date datatype is provided by mogoose itself
                    default:Date.now(),
                }
            }
        ],
    voteCount:{
        type:Number,
        default:0
    }
    
})

const candidate = mongoose.model('candidate',candidateSchema);
module.exports = candidate;