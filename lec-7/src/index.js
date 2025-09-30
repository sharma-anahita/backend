//second approach
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from 'express'
import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path : './env'
})
connectDB()

//first approach
/*

const app = express()

(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on('error',(err)=>{
            console.log('Error ',err);
            throw(err)
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Application listening on port number ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("Error ", error);

        throw error;
    }
})();
*/