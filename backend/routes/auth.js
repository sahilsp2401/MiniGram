const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "Itisasecrettokenbyminigram";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser',[
    body('name',"Enter a valid name").isLength({min:2}),
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password must be atleast 5 characters").isLength({min:5})
],async (req,res)=>{
    let success = false;
    // If there are errors,return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({success,errors: errors.array()});
      }
    try{
        //   Check whether the user with this eamill exists already
    let user = await User.findOne({email: req.body.email});
    if(user){
        success = false;
        return res.status(400).json({success,error : "Sorry a user with this email already exists!!!"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password:secPass,
        confirmation:req.body.confirmation
    });
    const data = {
        id : user.id
    }
    const authToken = jwt.sign(data,JWT_SECRET);

    // res.json({"Success":"Account created successfully"})
    success = true;
    res.json({success,authToken})
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
    // .then(user=>res.json(user)).catch(err=>res.json({error:"Please enter a unique value for email ",message: err.message})) //used when async and await is not used to resolve promise of create user.
})

// ROUTE 2: Authnenticate a User using: POST "/api/auth/login".No login required
router.post('/login',[
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password cannot be blank").exists(),
],async (req,res)=>{
    // If there are errors,return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
    try{
        const {email,password} = req.body;
        let success = false;
        let user = await User.findOne({email});
        if(!user){
            success = false
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success = false
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }
        const data = {
            id : user.id
        }
        const name = user.name
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true
        res.json({success,authToken,name})
    }
    catch(error){
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 3: Update an existing User using: PUT "/api/auth/forgotpassword".No Login required
router.post('/forgotpassword',[
    body('email',"Enter a valid email").isEmail(),
    body('confirmation',"Confirmation cannot be blank").exists(),
],async (req,res)=>{
    try{
        const {email,confirmation,password} = req.body;
        let success = false;
        // Create a newUser object
        const newUser = {};
        if(email){newUser.email = email};
        if(confirmation){newUser.confirmation = confirmation};
        if(password){
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password,salt);
            newUser.password = secPass
        };
        // Find the user to be updated and update it
        let user = await User.findOne({email});
        if(!user){
            success = false
            return res.status(404).send("Not Found")
        }
        if(user.confirmation!==confirmation){
            success = false
            return res.json({success});
        }
        let change = await User.findByIdAndUpdate(user._id ,{$set:newUser},{new:true})
        success = true
        res.json({success,change});
    }
    catch(error){
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router