import asyncHandler from "./asyncHandler.js";
import jwt from 'jsonwebtoken';
import user from "../models/userModel.js";

const authenticate = asyncHandler(async(req,res,next)=>{
    let token;

    token = req.cookies.jwt;

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.userId).select("-password");
            next();
        }
        catch(error){
            res.status(401);
            throw new Error("Not authorized, token Failed");
        }
    }else{
        res.status(401);
        throw new Error("Not authorized, No token");
    }
    

});


const authorizeAdmin = (req,res,next)=>{
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401).send("Not authorized as Admin");
    }
};


export {authenticate,authorizeAdmin };
