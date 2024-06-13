require('dotenv').config();   

const express = require('express');
const app = express();
const db = require('./db');     

const bodyParser = require('body-parser');      
app.use(bodyParser.json());                     
const PORT = process.env.PORT || 3000;          

app.get('/',function(req,res){   
    res.send('Welcome to Voting App');
})

//const {jwtAuthMiddleware} = require('./jwt');

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);

app.listen(PORT,()=>{
    console.log('Listening on port 3000');
})
