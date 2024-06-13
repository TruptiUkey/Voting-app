const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');
const bcrypt = require('bcrypt');
const { type } = require('os');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    mobile:{
        type:String,
    },
    email:{
        type:String,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    password:{
        type:String,
        required:true
    },
    isvoted:{
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function (next){   //pre is a middleware function that will execute when we try to perform save operation
    const user = this;
    //hash the password only if it has been modified(or is new)
    if(!user.isModified('password')) return next();
    try{
        //hash password generation
        const salt = await bcrypt.genSalt(10);
        //hash password
        const hashedPassword = await bcrypt.hash(User.password, salt);
        //override the plain password with the hashed one
        User.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        //use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User = mongoose.model('user',userSchema);
module.exports = User;