import { User } from "../models/user.model.js";
import { Interview } from "../models/interview.model.js";
import { Submission } from "../models/submission.model.js";

const getProfile = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findById(userId);
        const interviews = await Interview.find({ userId });
        const submissions = await Submission.find({ userId });
        console.log(user);
        console.log(user.createdAt);
        // =======================
        // Dashboard Stats
        // =======================
        const submissions1 = await Submission.find({ userId: user._id }).sort({ createdAt: -1 });
        let streak = 0;

if (submissions1.length > 0) {
    // Keep only one entry per day
    const uniqueDays = [];

    for (const sub of submissions1) {
        const day = new Date(sub.createdAt).toDateString();

        if (!uniqueDays.includes(day)) {
            uniqueDays.push(day);
        }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(uniqueDays[0]);
    firstDay.setHours(0, 0, 0, 0);

    const diff = Math.floor((today - firstDay) / (1000 * 60 * 60 * 24));

    // If latest interview wasn't today or yesterday, streak is 0
    if (diff <= 1) {

        let expected = new Date(firstDay);

        for (const day of uniqueDays) {

            const current = new Date(day);
            current.setHours(0, 0, 0, 0);

            if (current.getTime() === expected.getTime()) {
                streak++;
                expected.setDate(expected.getDate() - 1);
            } else {
                break;
            }
        }
    }
}
        const totalInterviews = interviews.length;

        const submittedIds = new Set(
            submissions.map(s => s.interviewId.toString())
        );

        const pending = interviews.filter(
            interview => !submittedIds.has(interview._id.toString())
        ).length;

        let averageScore = 0;
        let bestScore = 0;

        if (submissions.length > 0) {

            averageScore =
                submissions.reduce((sum, s) => sum + s.overallScore, 0) /
                submissions.length;

            bestScore = Math.max(
                ...submissions.map(s => s.overallScore)
            );
        }

        averageScore = Math.round(averageScore);

        // =======================
        // Interview Type Count
        // =======================

        let technical = 0;
        let hr = 0;
        let mixed = 0;

        // Difficulty

        let easy = 0;
        let medium = 0;
        let hard = 0;

        // Favourite Role

        const roleCount = {};

        interviews.forEach((interview) => {

            if (interview.interview_type === "Technical")
                technical++;

            else if (interview.interview_type === "HR")
                hr++;

            else
                mixed++;

            if (interview.difficulty === "Easy")
                easy++;

            else if (interview.difficulty === "Medium")
                medium++;

            else
                hard++;

            roleCount[interview.role] =
                (roleCount[interview.role] || 0) + 1;

        });

        let favouriteRole = "N/A";

        let mx = 0;

        for (let role in roleCount) {

            if (roleCount[role] > mx) {

                mx = roleCount[role];

                favouriteRole = role;

            }

        }

        // =======================
        // Recent Activity
        // =======================

        const recent = [];

        for (let submission of submissions
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5)) {

            const interview = await Interview.findById(
                submission.interviewId
            );

            if (!interview) continue;

            recent.push({

                submissionId: submission._id,

                role: interview.role,

                score: submission.overallScore,

                date: submission.createdAt,

            });

        }

        // =======================
        // Response
        // =======================

        res.json({

            joined: user.createdAt,

            totalInterviews,

            averageScore,

            bestScore,

            streak,

            pending,

            technical,

            hr,

            mixed,

            easy,

            medium,

            hard,

            favouriteRole,

            recent

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }
};

export { getProfile };