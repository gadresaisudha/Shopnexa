import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "../backend/routes/userRoutes.js";
import connectDB from "./config/db.js";
import categoryRoutes from './routes/categoryRoutes.js';
dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/api/users",userRoutes);
app.use("/api/category",categoryRoutes);

app.get("/",(req,res) =>{
    res.send("Hello world");
});

app.listen(port,()=>console.log(`server run at ${port}`));
