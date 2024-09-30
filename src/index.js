// require("dotenv").config({path: './env'})

import dotenv from "dotenv";
// import mongoose, { connect } from "mongoose";
// import { DB_NAME } from "./constants";
import connectDb from "./db/index.js";

dotenv.config({
    path: "./env"
})

connectDb()














// when we connect mongodb uri in index .js file
// import express from "express";

// const app = express();

// ( async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("Error:", error)
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`app is listening on port ${process.env.PORT}`)
//         })
//     }
//     catch (error){
//         console.log("mangodb connection error", error)
//         throw error
//     }
// })()