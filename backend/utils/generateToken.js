import jwt from "jsonwebtoken";

 const generateToken = (res,userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"10d"
    });
    
    // set JWT as HTTP -ONLY cookie
    res.cookie("jwt",token,{
        secure:process.env.NODE_ENV !== "development",
        sameSite:"strict",
        maxAge:10 * 24 * 60 * 1000 //10 days
    })
 }

 export default generateToken;