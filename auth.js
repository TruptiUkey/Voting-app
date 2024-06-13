const passport = require('passport');                       //importing passport middleware for authentication
const LocalStrategy = require('passport-local').Strategy;   //we will use this strategy for authentication => known as "username and password strategy"
const User = require('./models/User');               //Importing person model

passport.use(new LocalStrategy(async (aadharCardNumber, password, done) => {
    //authentication logic is here.
    try{
        // console.log('Received Credentials:',USERNAME, password);
        const user = await User.findOne({aadharCardNumber:aadharCardNumber});
        if(!user)
            return done(null, false,{message:'Incorrect username.'});
        
        const isPasswordMatch = user.comparePassword(password);
        if(isPasswordMatch){
            return done (null,user);
        }else{
            return done (null,false,{message:'Incorrect password'});
        }
    }
    catch(err){
        return done(err);
    }
}))

module.exports = passport;  //export configured passport
