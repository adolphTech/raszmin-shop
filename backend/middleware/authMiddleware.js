import jwt from "jsonwebtoken";
import asynchandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// protect routes
 const protect = asynchandler(async(req,res,next)=>{
    let token;

    // read the jwt from cookie
    token= req.cookies.jwt;

    if(token){
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select("-password")
            next()
        }catch(e){
            console.log(error)
            res.status(401)
            throw new Error("Not authorised , token failed");
        }

    }else{
        res.status(401)
        throw new Error("Not authorised , no token");

    }
})


// admin middleware
const admin = (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error("Not authorised as Admin");

    }
}

export {protect,admin};