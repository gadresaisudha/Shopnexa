import user from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import createToken from "../utilities/createToken.js";

const createUser = asyncHandler(async(req,res)=>{
   
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        throw new Error("Please fill all inputs");
    }

    const userExists = await user.findOne({email});
    if(userExists) res.status(400).send("User already exists");
    const encrypt = await bcrypt.genSalt(10)
    const hashedPassword   = await bcrypt.hash(password,encrypt);
    const newUser = new user({username,email,password: hashedPassword});

    try{
        await newUser.save();
        createToken(res, newUser._id);

        res.status(201).json({
            _id : newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    }
    catch(error){
        res.status(400);
        throw new Error("Invalid user");
    }
    

});


const loginUser = asyncHandler(async(req,res)=>{

    const {email,password} = req.body;
    const existingUser = await user.findOne({email});

    if(existingUser){
        const isPasswordValid = await bcrypt.compare(
            password, existingUser.password
        );
        if(isPasswordValid){
            createToken(res, existingUser._id);

            res.status(201).json({
                _id : existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
            });
            return;
        }
    }

});

const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly : true,
        expires : new Date(0),
    });
    res.status(200).json({message:"Logged Out"})
});
const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await user.find({});
    res.json(users);
});

const getCurrentUserProfile = asyncHandler(async(req,res)=>{
    const currentUser = await user.findById(req.user._id);
    if(currentUser){
        res.json({
            _id: currentUser._id,
            username: currentUser.username,
            email: currentUser.email
        })
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});
const updateCurrentUserProfile = asyncHandler(async(req,res)=>{
    const currentUser = await user.findById(req.user._id);
    if(currentUser){
        currentUser.username = req.body.username || currentUser.username;
        currentUser.email = req.body.email || currentUser.email;
        if(req.body.password){
            const encrypt = await bcrypt.genSalt(10)
            const hashedPassword   = await bcrypt.hash(req.body.password,encrypt);
            currentUser.password = hashedPassword;
        }
        const updatedUser = await currentUser.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});

const deleteUser = asyncHandler(async(req,res)=>{
    const currentUser = await user.findById(req.params.id);
    if(currentUser){
        if(currentUser.isAdmin){
            res.status(404);
            throw new Error("Admin cannot be deleted");
        }

        await user.deleteOne({_id:currentUser._id})
        res.json({message: "user removed"})
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});
const getUserById  = asyncHandler(async(req,res)=>{
    const currentUser = await user.findById(req.params.id).select("-password");
    if(currentUser){
        res.json(currentUser)
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});
const updateUserById  = asyncHandler(async(req,res)=>{
    const currentUser = await user.findById(req.params.id);
    if(currentUser){
        currentUser.username = req.body.username || currentUser.username;
        currentUser.email = req.body.email || currentUser.email;
        currentUser.isAdmin = Boolean(req.body.isAdmin) ;
        
        const updatedUser = await currentUser.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});



export {createUser, loginUser, logoutUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile, deleteUser, getUserById, updateUserById};