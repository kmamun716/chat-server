const User = require("../model/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports={
    register: async(req, res)=>{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email: email});
        if(!existingUser){
            bcrypt.hash(password, 11,(err, hash)=>{
                if(err){
                    console.log(err)
                }else{
                    const newUser = {
                        name, email, password: hash
                    }
                    User.create(newUser)
                        .then(user=>{
                            res.status(200).json({
                                message: 'user Registration Successfully',
                                user: user.email
                            })
                        })
                        .catch(err=>{
                            console.log(err)
                            res.status(500).json({
                                message: 'Server Error Occured'
                            })
                        })
                }
            })
        }else{
            res.status(400).json({
                message: 'User Already Registered'
            })
        }
    },
    login: async(req, res)=>{
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({
                message: 'User Not Found'
            })
        }else{
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                    console.log(err)                    
                }else{
                    if(!result){
                        return res.status(400).json({
                            message: 'Password Not Matched'
                        })
                    }else{
                        const token = jwt.sign({id: user.id, email: user.email}, process.env.SECRET);
                        res.status(200).json({
                            message: 'User Login Successfully',
                            token
                        })
                    }
                }
            })
        }
    },
    setAvatar: async(req, res)=>{

    },
    getUserById: async(req, res, next)=>{
        const id = req.params.id;
        try{
            const users = await User.find({_id: {$ne: id}}).select(["name", "email", "_id"]);
            return res.json(users)
        }catch(err){
            next(err)
        }
    }
}