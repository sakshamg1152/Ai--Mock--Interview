import {Submission} from "../models/submission.model.js";
import {Interview} from "../models/interview.model.js";
import httpStatus from "http-status";

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const totalInterviews = await Interview.countDocuments({ userId });
        const submissions = await Submission.find({ userId });
        const submissions1 = await Submission.find({ userId }).sort({ createdAt: 1 });
        const recentInterviews = await Submission.find({ userId }).populate("interviewId").sort({ createdAt: -1 }).limit(5);
        const averageScore =
            submissions.length === 0
                ? 0
                : submissions.reduce((sum, s) => sum + s.overallScore, 0) / submissions.length;

        const bestScore =
            submissions.length === 0
                ? 0
                : Math.max(...submissions.map(s => s.overallScore));

        const performance = submissions1.map((submission, index) => ({
            interview: `#${index + 1}`,
            score: submission.overallScore,
            date: submission.createdAt
        }));
        const recent = recentInterviews.map(item => ({
            submissionId: item._id,
            role: item.interviewId.role,
            difficulty: item.interviewId.difficulty,
            interview_type: item.interviewId.interview_type,
            no_of_questions: item.interviewId.no_of_questions,
            score: item.overallScore,
            date: item.createdAt
        }));
        res.json({
            totalInterviews,
            averageScore,
            bestScore,
            performance,
            recent
        });

    } catch (e) {
        return res.status(400).json({
            message: `Something went wrong ${e}`
        });
    }
};

const getPendingInterviews = async (req,res)=>{
    const userId = req.user.id;
    const interviews = await Interview.find({userId});
    const submissions = await Submission.find({userId})
        .select("interviewId");

    const completedIds = submissions.map(
        s => s.interviewId.toString()
    );
    const pending = interviews.filter(
        interview =>
            !completedIds.includes(interview._id.toString())
    );
    res.json({
        pending
    });
}


export {getDashboard , getPendingInterviews};