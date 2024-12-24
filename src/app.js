import express, { json } from "express";
import cors from "cors";
import coockieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(coockieParser())

// routes import
import userRouter from "./routes/user.routes.js"

// routes declaration

app.use("/api/v1/user", userRouter) // if you use to stander practice you use this code eighter use "/user", userRouter

// http://localhost:/api/v1/user/ragister

export default app;