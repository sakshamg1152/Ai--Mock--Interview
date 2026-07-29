import React  , {useState} from "react";
import "../styles/formPage.css";
import { useNavigate } from "react-router-dom";
import { InterviewContext } from '../contexts/InterviewContext';
import {
  FaArrowLeft,
  FaClipboardList,
} from "react-icons/fa";


function FormPage() {
    const [role, setRole] = useState("");
    const [questions, setQuestions] = useState("");
    const [experience, setExperience] = useState("");
    const [interviewType, setInterviewType] = useState("Technical");
    const [difficulty, setDifficulty] = useState("Medium");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { createInterviewF } = React.useContext(InterviewContext);

    const handleGenerateInterview = () => {
        if (
            !role ||
            !questions ||
            !experience ||
            !difficulty ||
            !interviewType
        ) {

            alert("Please fill all the fields.");

            return;
        }

        setLoading(true);

        setTimeout(() => {

            setLoading(false);

            alert("Interview Generated Successfully!");

        }, 2500);

    };

    const handleInterview = async() =>{
        try{
            console.log("");
            const result = await createInterviewF(role,questions,experience,interviewType,difficulty);
            console.log("RESULT : " , result);
            return result.interview._id
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    const handleButtonClick = async () =>{
        try{
            handleGenerateInterview();   
            const interviewId = await handleInterview();
            navigate(`/inter/${interviewId}`);  
        }catch(e){
            console.log(e);
            throw e;

        }
    }

    
  return (

    <div className="formPage">

      {/* ================= HEADER ================= */}

      <div className="formTopBar">

        <button className="backButton" onClick={()=> navigate("/home")}>

          <FaArrowLeft />

          Back to Dashboard

        </button>

      </div>

      {/* ================= HERO ================= */}

      <div className="formHero">

        <div className="heroIcon">

          <FaClipboardList />

        </div>

        <h1>

          Start Your Mock Interview

        </h1>

        <p>

          Customize your interview by selecting the options below.

          AI will generate personalized questions based on your choices.

        </p>

      </div>

      {/* ================= FORM CONTAINER ================= */}

      <div className="formContainer">

        {/* ================= ROLE ================= */}

<div className="formGroup">

    <label>

        Role

    </label>

    <select
        value={role}
        onChange={(e)=>setRole(e.target.value)}
    >

        <option value="">Select Role</option>

        <option>Frontend Developer</option>

        <option>Backend Developer</option>

        <option>Full Stack Developer</option>

        <option>Software Engineer</option>

        <option>React Developer</option>

        <option>Node.js Developer</option>

        <option>Java Developer</option>

        <option>Python Developer</option>

        <option>C++ Developer</option>

        <option>Data Analyst</option>

        <option>System Design</option>

        <option>HR Interview</option>

    </select>

</div>



{/* ================= QUESTIONS ================= */}

<div className="formGroup">

    <label>

        Number of Questions

    </label>

    <select
        value={questions}
        onChange={(e)=>setQuestions(e.target.value)}
    >

        <option value="">Choose</option>

        <option>5</option>

        <option>10</option>

        <option>15</option>

        <option>20</option>
        <option>25</option>
        <option>30</option>
        <option>40</option>


    </select>

</div>



{/* ================= EXPERIENCE ================= */}

<div className="formGroup">

    <label>

        Experience

    </label>

    <select
        value={experience}
        onChange={(e)=>setExperience(e.target.value)}
    >

        <option value="">Select Experience</option>

        <option>Fresher</option>

        <option>1 Year</option>

        <option>2 Years</option>

        <option>3 Years</option>

        <option>5+ Years</option>

    </select>

</div>

{/* ================= INTERVIEW TYPE ================= */}

<div className="formGroup">

    <label>

        Interview Type

    </label>

    <div className="optionGrid">

        <div
            className={`optionCard ${
                interviewType === "Technical" ? "selected" : ""
            }`}
            onClick={() => setInterviewType("Technical")}
        >

            <div className="optionIcon">

                💻

            </div>

            <div>

                <h3>Technical</h3>

                <p>Coding & Technical Questions</p>

            </div>

        </div>

        <div
            className={`optionCard ${
                interviewType === "HR" ? "selected" : ""
            }`}
            onClick={() => setInterviewType("HR")}
        >

            <div className="optionIcon">

                👔

            </div>

            <div>

                <h3>HR</h3>

                <p>Behavioral Questions</p>

            </div>

        </div>

        <div
            className={`optionCard ${
                interviewType === "Mixed" ? "selected" : ""
            }`}
            onClick={() => setInterviewType("Mixed")}
        >

            <div className="optionIcon">

                🔀

            </div>

            <div>

                <h3>Mixed</h3>

                <p>Technical + HR</p>

            </div>

        </div>

    </div>

</div>



{/* ================= DIFFICULTY ================= */}

<div className="formGroup">

    <label>

        Difficulty Level

    </label>

    <div className="difficultyGrid">

        <div
            className={`difficultyCard ${
                difficulty === "Easy" ? "activeDifficulty" : ""
            }`}
            onClick={() => setDifficulty("Easy")}
        >

            🟢 Easy

        </div>

        <div
            className={`difficultyCard ${
                difficulty === "Medium" ? "activeDifficulty" : ""
            }`}
            onClick={() => setDifficulty("Medium")}
        >

            🟡 Medium

        </div>

        <div
            className={`difficultyCard ${
                difficulty === "Hard" ? "activeDifficulty" : ""
            }`}
            onClick={() => setDifficulty("Hard")}
        >

            🔴 Hard

        </div>

    </div>

</div>

{/* ================= SUMMARY ================= */}

<div className="summaryCard">

    <h2>

        Interview Summary

    </h2>

    <div className="summaryRow">

        <span>Role</span>

        <strong>{role || "--"}</strong>

    </div>

    <div className="summaryRow">

        <span>Questions</span>

        <strong>{questions || "--"}</strong>

    </div>

    <div className="summaryRow">

        <span>Experience</span>

        <strong>{experience || "--"}</strong>

    </div>

    <div className="summaryRow">

        <span>Interview Type</span>

        <strong>{interviewType}</strong>

    </div>

    <div className="summaryRow">

        <span>Difficulty</span>

        <strong>{difficulty}</strong>

    </div>

</div>



{/* ================= BUTTON ================= */}

<button

    className="generateBtn"
    disabled={loading}
    onClick={() => {
    console.log("Calling handleInterview");
    handleButtonClick()}}
    
>

    {

        loading ?

        "Generating AI Interview..."

        :

        "🚀 Generate Interview"

    }

</button>

      </div>

    </div>

  );

}

export default FormPage;