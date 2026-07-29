import React, { useState, useEffect } from "react";
import "../styles/feedbackPage.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaRobot,
    FaRedo,
    FaCheckCircle,
    FaTimesCircle,
    FaArrowLeft,
    FaStar
} from "react-icons/fa";

function FeedbackPage() {
    const router = useNavigate();
    const [questions, setQuestions] = useState([]); // This will now hold [{ text: "...", score: 85 }]
    const [weakness, setWeakness] = useState([]);
    const [strength, setStrength] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [overall_score, setOverall_score] = useState(0);
    const { id } = useParams();
    const [role, setRole] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [no_of_questions, setNo_of_questions] = useState(0);
    const [intetId , setInterId] = useState("");

    const fetchData = async (interviewId) => {
        if (!interviewId) return;
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `https://ai-mock-interview-code-arena.vercel.app/api/interview/${interviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const interviewData = response.data.interview;
            if (interviewData) { 
                setRole(interviewData.role);
                setDifficulty(interviewData.difficulty);
                setNo_of_questions(interviewData.no_of_questions);
            }
        } catch (e) {
            console.error("Error fetching interview data:", e);
        }
    };

    const fetchResult = async () => {
        try {
            console.log("Fetching submission with ID parameter:", id); 
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `https://ai-mock-interview-code-arena.vercel.app/api/submission/sub/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Full API Response:", response.data);

            const sub_details = response?.data?.submission;
            
            if (sub_details) {
                if (sub_details.answers) {
                    const cleanQuestionsWithScores = sub_details.answers.map((item) => ({
                        text: item.question || "Technical Question",
                        score: item.score ?? 0 // Uses backend item score, fallbacks to 0
                    }));
                    setQuestions(cleanQuestionsWithScores);
                }

                setWeakness(sub_details.weaknesses || []);
                setStrength(sub_details.strengths || []);
                setFeedback(sub_details.final_feedback || "");
                setOverall_score(sub_details.overallScore || 0);
                
                if (sub_details.interviewId) {
                    fetchData(sub_details.interviewId);
                    setInterId(sub_details.interviewId);
                }
            } else {
                console.error("Submission details missing from response object structure.");
            }
        } catch (e) {
            console.error("Error fetching submission details:", e);
        }
    };

    // Fixed the PHP-style dot string concatenation syntax error
    console.log("strength : ", strength);

    useEffect(() => {
        if (id) {
            fetchResult();
        }
    }, [id]);

    return (
        <div className="feedbackPage">
            {/* ================= NAVBAR ================= */}
            <nav className="feedbackNavbar">
                <div className="feedbackLogo">
                    <FaRobot />
                    <span>MockAI</span>
                </div>
                <h2>Interview Feedback Report</h2>
                <div className="feedbackButtons">
                    <button className="retakeBtn" onClick={() => router(`/inter/${intetId}`)}>
                        <FaRedo /> Retake Interview
                    </button>
                </div>
            </nav>

            {/* ================= MAIN ================= */}
            <div className="feedbackContainer">
                {/* ================= LEFT PANEL ================= */}
                <div className="leftPanel">
                    <div className="questionCard">
                        <h3>Question Scores</h3>
                        {questions.map((question, index) => (
                            <div className="questionItem" key={index}>
                                <div className="questionNumber">Q{index + 1}</div>
                                <div className="questionContent">
                                    <h4>{question.text}</h4>
                                    {/* Displaying the individual score with an icon badges */}
                                    <div className="questionScoreBadge">
                                        <FaStar className="starIcon" /> Score: {question.score}/10
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= CENTER PANEL ================= */}
                <div className="centerPanel">
                    <div className="overallCard">
                        <h2>Overall Performance</h2>
                        <div className="overallTop">
                            <div className="overallScore">
                                <div className="scoreRing">
                                    <span>{overall_score}%</span>
                                </div>
                                <h3>Overall Score</h3>
                            </div>

                            <div className="overallStats">
                                <div className="statBox">
                                    <h4>Role</h4>
                                    <p>{role || "N/A"}</p>
                                </div>
                                <div className="statBox">
                                    <h4>Difficulty</h4>
                                    <p>{difficulty || "N/A"}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                <div className="rightPanel">
                    <div className="feedbackCard">
                        <h2>
                            <FaCheckCircle className="greenIcon" /> Strengths
                        </h2>
                        <ul className="feedbackList">
                            {strength.map((item, index) => (
                                <li key={index}>
                                    <FaCheckCircle className="greenBullet" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="feedbackCard">
                        <h2>
                            <FaTimesCircle className="redIcon" /> Areas to Improve
                        </h2>
                        <ul className="feedbackList">
                            {weakness.map((item, index) => (
                                <li key={index}>
                                    <FaTimesCircle className="redBullet" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="feedbackCard">
                        <h2>Overall Feedback</h2>
                        <div className="overallFeedback">
                            {feedback || "No feedback generated."}
                            <div className="feedbackScore">
                                Final Rating
                                <span>{overall_score}/100</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= BOTTOM ACTION BAR ================= */}
            <div className="bottomActions">
                <button className="dashboardBtn" onClick={() => router("/home")}>
                    <FaArrowLeft /> Back to Dashboard
                </button>
                <button className="retakeLargeBtn" onClick={() => router(`/inter/${intetId}`)}>
                    <FaRedo /> Retake Interview
                </button>
            </div>
        </div>
    );
}

export default FeedbackPage;