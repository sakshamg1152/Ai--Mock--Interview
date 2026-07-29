import React, { useState, useEffect } from "react"; 
import { useAuth } from "../contexts/AuthContext";
import "../styles/interviewPage.css";
import axios from "axios";
import { useParams , useNavigate } from "react-router-dom"; 
import { SubmissionContext } from '../contexts/SubmissionContext';

import {
  FaRobot,
  FaClock,
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaCode,
  FaSignal,
  FaUserGraduate, 
  FaLayerGroup,
  FaUndo,
  FaLightbulb,
  FaMagic        
} from "react-icons/fa";

function InterviewPage() {
  const router = useNavigate();

  const { answerCheckingF } = React.useContext(SubmissionContext);
  const { userData } = useAuth();
  const { id } = useParams();
  const [questions , setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]); 
  const [role , setRole] = useState("");
  const [difficulty , setDifficulty] = useState("");
  const [experinece , setExperinece] = useState("");
  const [no_of_questions , setNo_of_questions] = useState(0);
  const [interview_type , setInterview_type] = useState("");
  const [time , setTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ================= API FETCH FUNCTION ================= */
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
          `https://ai-mock-interview-code-arena.vercel.app/api/interview/${id}`,
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          }
      );
      const interviewData = response.data.interview; 

      if (interviewData && interviewData.questions) {
        setQuestions(interviewData.questions);
        setAnswers(new Array(interviewData.questions.length).fill("// Write your answer here...\n\n"));
        
        setRole(interviewData.role);
        setDifficulty(interviewData.difficulty);
        setExperinece(interviewData.experience);
        setNo_of_questions(interviewData.no_of_questions);
        setInterview_type(interviewData.interview_type);
      }
    } catch (e) {
      console.error("Error fetching interview data:", e);
    }
  };

  useEffect(() => {
    if (no_of_questions > 0) {
        setTime(Number(no_of_questions) * 2 * 60);
        setIsLoaded(true);
    }
  }, [no_of_questions]);
  
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if(!isLoaded){
        return;
    }
    if (time <= 0) {
        if (questions.length > 0) {
            alert("Your time is up!");
            handleFinish();
        }
        return;
    }

    const timer = setTimeout(() => {
        setTime(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, questions.length, isLoaded]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    const handleUnload = () => {
      navigator.sendBeacon(
        '/api/end-interview',
        JSON.stringify({ id, reason: 'user_refreshed' })
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [id]);

  /* ================= ANSWER CHANGE ================= */
  const handleAnswerChange = (e) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = e.target.value;
    setAnswers(updatedAnswers);
  };

  /* ================= NAVIGATION ================= */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  /* ================= SUBMISSION MANAGEMENT ================= */
  const handleSubmission = async () => {
    try {
      const result = await answerCheckingF(id, questions, answers);
      console.log("Hello");
      console.log("RESULT SUBMISSION ID: ", result);
      return result.submission._id; 
    } catch (e) {
      console.log("Submission evaluation crash: ", e);
      throw e;
    }
  };

  const handleFinish = async () => {
    console.log("Submitted Answers: ", answers);
    alert("Interview Submitted Successfully! Calculating score...");
    
    try {
      const targetSubmissionId = await handleSubmission();
      if (targetSubmissionId) {
        router(`/feed/${targetSubmissionId}`);
      } else {
        console.error("Submission resolved to an empty value.");
        alert("We had trouble retrieving your evaluation. Check the dev console.");
      }
    } catch (err) {
      console.error("Failed handling finish logic: ", err);
    }
  };

  const handleReset = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = "// Write your answer here...\n\n";
    setAnswers(updatedAnswers);
  };

  if (questions.length === 0) {
    return <div className="loadingContainer">Loading Interview Questions...</div>;
  }

  return (
    <div className="interviewPage">
      {/* ================= NAVBAR ================= */}
      <nav className="interviewNavbar">
        <div className="navLeft">
          <div className="logo">
            <FaRobot className="logoIcon" />
            <span>MockAI</span>
          </div>
          <div className="divider"></div>
          <span className="navbarTitle">
            <FaMagic className="sparkleIcon" /> AI Mock Interview
          </span>
        </div>
        <div className="navRight">
          <button className="finishBtn" onClick={handleFinish}>
            End Interview
          </button>
          <div className="userAvatar">{userData?.username ? userData.username[0] : "U"}</div>
        </div>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <div className="interviewContainer">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="leftSidebar">
          <div className="sideCard progressCard">
            <h3>Interview Progress</h3>
            <div className="progressVisual">
              <div className="progressCircleContainer">
                <svg className="svgCircle" viewBox="0 0 100 100">
                  <circle className="bgCircle" cx="50" cy="50" r="40" />
                  <circle 
                    className="fgCircle" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    style={{
                      strokeDasharray: 251.2,
                      strokeDashoffset: 251.2 - (251.2 * ((currentQuestion + 1) / questions.length))
                    }}
                  />
                </svg>
                <div className="circleText">
                  <span className="currentNum">{currentQuestion + 1}</span>
                  <span className="totalNum">of {questions.length}</span>
                </div>
              </div>
            </div>
            <h4 className="completionStatus">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Completed
            </h4>
            <div className="horizontalProgressBar">
              <div 
                className="horizontalProgressFill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="sideCard detailsCard">
            <h3>Interview Details</h3>
            <div className="detailItem">
              <FaBriefcase className="detailIcon" />
              <div>
                <span>Role</span>
                <p>{role}</p>
              </div>
            </div>
            <div className="detailItem">
              <FaCode className="detailIcon" />
              <div>
                <span>Type</span>
                <p>{interview_type}</p>
              </div>
            </div>
            <div className="detailItem">
              <FaSignal className="detailIcon" />
              <div>
                <span>{difficulty}</span>
                <span className="badgeDifficulty">Medium</span>
              </div>
            </div>
            <div className="detailItem">
              <FaUserGraduate className="detailIcon" />
              <div>
                <span>Experience</span>
                <p>{experinece}</p>
              </div>
            </div>
            <div className="detailItem">
              <FaLayerGroup className="detailIcon" />
              <div>
                <span>Questions</span>
                <p>{no_of_questions}</p>
              </div>
            </div>
          </div>

          <div className="sideCard navigatorCard">
            <h3>Question Navigator</h3>
            <div className="questionNumbersGrid">
              {questions.map((item, index) => (
                <button
                  key={item._id || index}
                  className={`navNumBtn ${currentQuestion === index ? "activeQuestion" : ""}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= CENTER MAIN SECTION ================= */}
        <main className="centerSection">
          <div className="centerTopBar">
            <div className="questionBadge">
              <FaCode className="badgeIcon" /> Question {currentQuestion + 1}
            </div>
            <div className="timerCard">
              <FaClock className="timerIcon" />
              <div>
                <span className="timeVal">{time}</span>
                <span className="timeLabel">Seconds Left</span>
              </div>
            </div>
          </div>

          <div className="questionDisplayCard">
            <h2>{questions[currentQuestion]?.question}</h2>
          </div>

          <div className="editorCard">
            <div className="editorHeader">
              <h3>Your Answer</h3>
            </div>

            <div className="codeContainer">
              <div className="lineNumbers">
                {[...Array(20)].map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                className="codeEditor"
                spellCheck="false"
                value={answers[currentQuestion] || ""}
                onChange={handleAnswerChange}
              />
            </div>

            <div className="editorFooter">
              <button className="resetBtn" onClick={handleReset}>
                <FaUndo className="btnIcon" /> Reset
              </button>
            </div>
          </div>

          <div className="bottomNavigation">
            <button
              className="bottomNavBtn prevBtn"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <FaArrowLeft className="navIcon" /> Previous
            </button>
            
            {currentQuestion === questions.length - 1 ? (
              <button className="bottomNavBtn actionBtn finishActionBtn" onClick={handleFinish}>
                Finish Interview
              </button>
            ) : (
              <button className="bottomNavBtn actionBtn nextActionBtn" onClick={handleNext}>
                Next Question <FaArrowRight className="navIcon" />
              </button>
            )}
          </div>
        </main>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="rightSidebar">
          <div className="sideCard instructionsCard">
            <h3>Instructions</h3>
            <ol>
              <li><span>1.</span><p>Read the question carefully</p></li>
              <li><span>2.</span><p>Write clean and correct code</p></li>
              <li><span>3.</span><p>Click submit Answer for submitting the answer.</p></li>
              <li><span>4.</span><p>Click Next to proceed</p></li>
            </ol>
          </div>

          <div className="sideCard tipsCard">
            <div className="tipsHeader">
              <FaLightbulb className="bulbIcon" />
              <h3>Tips</h3>
            </div>
            
            <div className="tipItem">
              <div className="tipIndicator tipGreen">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path></svg>
              </div>
              <p>Take a deep breath and think step by step.</p>
            </div>

            <div className="tipItem">
              <div className="tipIndicator tipPurple">
                <FaCode size={12} />
              </div>
              <p>Write readable and well-structured code.</p>
            </div>

            <div className="tipItem">
              <div className="tipIndicator tipBlue">
                <FaClock size={12} />
              </div>
              <p>Manage your time effectively.</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

export default InterviewPage;