import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js"
import submissionRouter from "./routes/submission.route.js"
import homeRouter from "./routes/home.route.js"
import profileRouter from "./routes/profile.route.js";
import dotenv from "dotenv";
dotenv.config();



const app=express();

app.use(cors());
app.use(express.json({limit : "40kb"}));
app.use(express.urlencoded({limit : "40kb" , extended: true}))

app.use("/api/v1/users", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/submission", submissionRouter);
app.use("/api/dash" , homeRouter)
app.use("/api/profile", profileRouter);



console.log("MONGO_URL exists:", !!process.env.MONGO_URL);
console.log("MONGO_URL starts with:", process.env.MONGO_URL?.substring(0, 20));
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 30000,
})
.then(() => {
  console.log("✅ Connected to DB");
})
.catch((err) => {
  console.error("❌ Mongo Error:", err);
});

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running successfully"
    });
});

export default app;
