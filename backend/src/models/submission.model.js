import { Schema } from "mongoose";
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
{
    interviewId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Interview"
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    answers:[
        {
            question:String,
            answer:String,
            score:Number,
            correct_answer:String
        }
    ],

    overallScore:Number,

    strengths:[String],

    weaknesses:[String],

    final_feedback:String
},
{
    timestamps:true
});

export const Submission = mongoose.model("Submission", submissionSchema);