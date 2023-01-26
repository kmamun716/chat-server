const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1juc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


app.use('/api/user', require('./routes/userRoutes'))

const server = app.listen(port, ()=>{
    console.log(`server is running at port: ${port}`);
    mongoose.connect(uri, (err)=>{
        if(err) throw err;
        console.log('database connected')
    })
});