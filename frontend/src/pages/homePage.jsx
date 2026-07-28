import React from "react";
import PerformanceChart from "./PerformanceChart";
import "../styles/homePage.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate , Link } from "react-router-dom";
import axios from "axios";


import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaFire,
  FaChartLine,
  FaStar,
  FaClipboardList,
} from "react-icons/fa";
import { useState  , useEffect} from "react";

function HomePage() {
    const { userData } = useAuth();
    const router = useNavigate();
    const [totalInterview , setTotalInterview] = useState(0);
    const [average , setAverage] = useState(0);
    const [best_score , setBest_score] = useState(0);
    const [pending,setPending]=useState([]);
    const [performance,setPerformance] = useState([]);
    const [recentInterviews, setRecentInterviews] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:8000/api/dash/getdash",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setTotalInterview(response.data.totalInterviews);
            setAverage(response.data.averageScore);
            setBest_score(response.data.bestScore);
            setPerformance(response.data.performance);
            setRecentInterviews(response.data.recent);
            

        } catch (e) {
            console.log(e);
        }
    };

    const fetchPending = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:8000/api/dash/pending",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setPending(response.data.pending);
        } catch (e) {
            console.log(e);
        }
    };

    const handleSearch = async (value) => {
        setSearch(value);
        if(value.trim()===""){
            setSearchResult([]);
            return;
        }
        try{
            const token = localStorage.getItem("token");
            const response = await axios.get(

                `http://localhost:8000/api/interview/search?role=${value}`,

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );

            setSearchResult(response.data.interviews);

        }catch(e){
            console.log(e);
        }

    }


    useEffect(() => {
        fetchDashboard();
        fetchPending();
    }, []);


  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

    <div className="logo">
        <span className="logoCircle">🤖</span>
        <h2>MockAI</h2>
    </div>

    <div className="searchContainer">

        <FaSearch className="searchIcon" />

        <input
            type="text"
            className="searchInput"
            placeholder="Search interviews..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
        />

        {search.length > 0 && (
            <div className="searchDropdown">

                {searchResult.length === 0 ? (

                    <div className="searchItem noResult">
                        No interview found
                    </div>

                ) : (

                    searchResult.map((item) => (

                        <div
                            key={item._id}
                            className="searchItem"
                            onClick={() => {
                                setSearch("");
                                setSearchResult([]);
                                router("/form");
                            }}
                        >

                            <h4>{item.role}</h4>

                            <p>
                                {item.difficulty} • {item.interview_type}
                            </p>

                        </div>

                    ))

                )}

            </div>
        )}

    </div>

    <div className="navRight">

        <FaUserCircle
            className="profileIcon"
            onClick={() => router("/profile")}
        />

        <p onClick={() => router("/profile")}>
            {userData?.username}
        </p>

    </div>

</nav>


      {/* ================= HERO ================= */}

      <section className="welcomeBanner">

        <div>

          <h1>

            Welcome,
            <span> {userData?.username} 👋</span>

          </h1>

          <p>

            Continue improving your interview skills
            with AI-powered mock interviews.

          </p>

          <button onClick={()=> router("/form")}>

            Start New Interview

          </button>

        </div>

        <div className="bannerImage">

          <img
            src="/images/home-banner.png"
            alt="AI Interview"
          />

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="statsSection">

        <div className="statCard">

          <FaClipboardList className="statIcon"/>

          <h2>{totalInterview}</h2>

          <p>Total Interviews</p>

        </div>

        <div className="statCard">

          <FaChartLine className="statIcon"/>

          <h2>{average}%</h2>

          <p>Average Score</p>

        </div>

        <div className="statCard">

          <FaStar className="statIcon"/>

          <h2>{best_score}%</h2>

          <p>Best Score</p>

        </div>

      </section>
      {/* ================= CONTINUE PRACTICE ================= */}

<section className="continueSection">

    <div className="sectionTitle">

        <h2>Continue Practice</h2>

        <span>Resume where you left off</span>

    </div>

    {

        pending.length === 0 ?

        (

            <div className="continueCard emptyContinue">

                <div className="continueLeft">

                    <div className="continueIcon">

                        ✅

                    </div>

                    <div>

                        <h3>No Pending Interviews</h3>

                        <p>
                            Great job! You have completed all your interviews.
                        </p>

                    </div>

                </div>

            </div>

        )

        :

        (

            pending.map((item)=>(

                <div
                    className="continueCard"
                    key={item._id}
                >

                    <div className="continueLeft">

                        <div className="continueIcon">

                            💻

                        </div>

                        <div>

                            <h3>

                                {item.role}

                            </h3>

                            <p>

                                {item.interview_type} • {item.difficulty}

                            </p>

                            <p>

                                {item.experience}

                            </p>

                            <div className="progressBar">

                                <div
                                    className="progressFill"
                                    style={{
                                        width: "0%"
                                    }}
                                ></div>

                            </div>

                            <span className="progressText">

                                Not Started

                            </span>

                        </div>

                    </div>

                    <div className="continueRight">

                        <span className="timeLeft">

                            {item.no_of_questions} Questions

                        </span>

                        <button
                            onClick={() =>
                                router(`/inter/${item._id}`)
                            }
                        >

                            Continue →

                        </button>

                    </div>

                </div>

            ))

        )

    }

</section>
{/* ================= INTERVIEW CATEGORIES ================= */}

<section className="categorySection">

    <div className="sectionTitle">

        <h2>Choose Interview Category</h2>

        <span>Practice with AI in your favorite domain</span>

    </div>

    <div className="categoryGrid">

        <div className="categoryCard">

            <div className="categoryIcon">💻</div>

            <h3>Frontend</h3>

            <p>
                React, HTML, CSS, JavaScript,
                Redux and UI interviews.
            </p>

            <button onClick={()=> router("/form")}>Practice Now</button>

        </div>


        <div className="categoryCard">

            <div className="categoryIcon">⚙️</div>

            <h3>Backend</h3>

            <p>
                Node.js, Express, APIs,
                Databases and Authentication.
            </p>

            <button onClick={()=> router("/form")}>Practice Now</button>

        </div>


        <div className="categoryCard">

            <div className="categoryIcon">🚀</div>

            <h3>Full Stack</h3>

            <p>
                MERN Stack, System Design,
                Deployment and Architecture.
            </p>

            <button onClick={()=> router("/form")}>Practice Now</button>

        </div>


        <div className="categoryCard">

            <div className="categoryIcon">📊</div>

            <h3>Data Analyst</h3>

            <p>
                SQL, Excel, Python,
                Power BI and Statistics.
            </p>

            <button onClick={()=> router("/form")}>Practice Now</button>

        </div>


        <div className="categoryCard">

            <div className="categoryIcon">👔</div>

            <h3>HR Interview</h3>

            <p>
                Behavioral questions,
                communication and confidence.
            </p>

            <button onClick={()=> router("/form")}>Practice Now</button>

        </div>


        <div className="categoryCard">

            <div className="categoryIcon">🏗️</div>

            <h3>System Design</h3>

            <p>
                Scalability, Caching,
                Load Balancing and Design.
            </p>

            <button onClick={()=> router("/form")}>Practice Now</button>

        </div>

    </div>

</section>

<PerformanceChart data={performance}/>


{/* ================= RECENT INTERVIEWS ================= */}

<section className="recentInterviewSection">

    <div className="sectionTitle">

        <h2>Recent Interviews</h2>


    </div>

    <div className="recentInterviewList">

{
    recentInterviews.length === 0 ?

    (

        <div className="recentInterviewCard">

            <div className="interviewInfo">

                <div className="interviewLogo">

                    📄

                </div>

                <div>

                    <h3>No Interviews Yet</h3>

                    <p>
                        Complete your first interview to see your reports here.
                    </p>

                </div>

            </div>

        </div>

    )

    :

    (

        recentInterviews.map((item)=>(

            <div
                className="recentInterviewCard"
                key={item.submissionId}
            >

                <div className="interviewInfo">

                    <div className="interviewLogo">

                        {
                            item.interview_type === "Technical"
                            ? "💻"
                            : item.interview_type === "HR"
                            ? "👔"
                            : "🧠"
                        }

                    </div>

                    <div>

                        <h3>

                            {item.role}

                        </h3>

                        <p>

                            {new Date(item.date).toLocaleDateString()} • {item.difficulty} • {item.no_of_questions} Questions

                        </p>

                    </div>

                </div>

                <div className="interviewResult">

                    <span
                        className={
                            item.score >= 90
                            ? "score excellent"
                            : item.score >= 75
                            ? "score good"
                            : "score average"
                        }
                    >

                        {item.score}%

                    </span>

                    <button
                        onClick={() =>
                            router(`/feed/${item.submissionId}`)
                        }
                    >

                        Open Report

                    </button>

                </div>

            </div>

        ))

    )

}

</div>

</section>


{/* ================= FOOTER ================= */}

<footer className="dashboardFooter">

    <div className="footerLeft">

        <h2>

            🤖 MockAI

        </h2>

        <p>

            Practice Smarter.
            Crack Interviews Faster.

        </p>

    </div>

    <div className="footerLinks">

        <Link to="/home">About</Link>

        <Link to="/home">privacy</Link>

        <Link to="/home">Terms</Link>

        <Link to="/home">Support</Link>

    </div>

    <div className="footerCopy">

        © 2026 MockAI. All rights reserved.

    </div>

</footer>

    </div>
  );
}

export default HomePage;