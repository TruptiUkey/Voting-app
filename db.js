const mongoose = require('mongoose');

//const mongoURL = process.env.MONGODB_URL_LOCAL;     //using variable from .env file
const mongoURL = process.env.MONGODB_URL;           //using variable from .env file

mongoose.connect(mongoURL);         
const db = mongoose.connection;     //mongoose maintains default database object so that it will connect to its database

//------------Defining event listeners
db.on('connected',()=>{
    console.log('connected to mongodb server');
})
db.on('error',(err)=>{
    console.log('Mongodb connection error',err);
})
db.on('disconnected',()=>{
    console.log('disconnected to mongodb server');
})

module.exports = db;
