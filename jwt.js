const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req,res,next) => {
    //first check request headers has authorization or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error:'Token Not Found'});
    
    //Extract jwt token from request header
    const token = req.headers.authorization.split(' ')[1];  //separated by space and kept at index 1.
    if(!token) return res.status(401).json({errors:'Unauthorized'});
    try{
        //verify the jwt Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach user information to request object
        req.user = decoded;
        next();
    }
    catch(err){
        console.error(err);
        res.status(401).json({error:'Invalid token'});
    }
}

//function to generate jwt token
const generateToken = (userData) => {
    //generate new JWT Token using user data.
    return jwt.sign(userData, process.env.JWT_SECRET,{});
}

module.exports = { jwtAuthMiddleware, generateToken}