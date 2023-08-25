import asyncHandler from "../middleware/asyncHandler.js"
import User from "../models/userModel.js"
import generateToken from  "../utils/generateToken.js"


// @desc Auth user & token
// @route POST api/users/login
// @access Public

export const authUser = asyncHandler(async(req,res)=>{
   const {email,password}= req.body;

   const user = await User.findOne({email})

   if(user && (await user.matchPassword(password))){
     generateToken(res,user._id)

    res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin 

    })
   }else{
    res.status(401)
    throw new Error("Invalid email or password")
   }
    

})


// @desc register user 
// @route POST api/users/REGISTER
// @access Public

export const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("user already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res,user._id)
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        })
    }else{
       res.status(400) ;
       throw new Error ("Invalid user data")
    }

})

// @desc Logout user /clear  cookie
// @route POST api/users/LOGOUT
// @access Private

export const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie("jwt","",{
        httpOnly:true,
        expires:new Date(0)
    }).status(200).json({mesage:"logged out success"})
})

// @desc get user profile
// @route GET api/users/PROFILE
// @access PRIVATE 

export const getUserProfile = asyncHandler(async(req,res)=>{
   const user = await User.findById(req.user._id);

   if(user){
    res.status(200).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin
    })
   }else{
    res.status(404);
    throw new Error("user not found")
   }

})

// @desc update user 
// @route PUT api/users/PROFILE
// @access PRIVATE 

export const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
     user.name=  req.body.name || user.name;
     user.email=  req.body.email || user.email;

     if(req.body.password){
        user.password = req.body.password
     }

     const updatedUser = await user.save()

     res.status(200).json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        isAdmin:updatedUser.isAdmin
     })
    }else{
     res.status(404);
     throw new Error("user not found")
    }

})

// @desc get users
// @route GET api/users
// @access PRIVATE 

export const getUsers = asyncHandler(async(req,res)=>{
    res.send (" users")

})

// @desc get user by id
// @route GET api/users/:id
// @access PRIVATE/admin

export const getUserByID = asyncHandler(async(req,res)=>{
    res.send ("get user by id")

})

// @desc delete user 
// @route DELETE api/users/:ID
// @access PRIVATE/admin 

export const deleteUser= asyncHandler(async(req,res)=>{
    res.send (" delete users")

})

// @desc update users
// @route GET api/users/:id
// @access PRIVATE/admin 

export const updateUser = asyncHandler(async(req,res)=>{
    res.send (" update user")

})