import mongoose, { Schema } from "mongoose";

const interviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },

    experience: {
      type: String,
      enum: ["Fresher", "1 Year", "2 Years", "3 Years", "5+ Years"],
    },

    no_of_questions: Number,

    interview_type: {
      type: String,
      enum: ["Technical", "HR", "Mixed"],
    },

    questions: [
      {
        question: String,
      },
    ],
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);