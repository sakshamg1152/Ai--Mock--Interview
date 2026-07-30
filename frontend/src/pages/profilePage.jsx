import React, { useEffect, useState } from "react";
import "../styles/profilePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

import {
  FaArrowLeft,
  FaUserCircle,
  FaClipboardList,
  FaChartLine,
  FaTrophy,
  FaFire,
} from "react-icons/fa";

function ProfilePage() {
  const router = useNavigate();
  const { userData } = useAuth();

  const [profile, setProfile] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    streak: 0,
    joined: "",
    pending: 0,
    technical: 0,
    hr: 0,
    mixed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    favouriteRole: "N/A",
    recent: [],
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://ai-mock-interview-sandy-gamma.vercel.app/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () =>{
    let choice = window.confirm("Do you want to logout your account !");
    if(choice){
        router("/auth");
    }
  }
  const handlePasswordChange = async () =>{
    let choice = window.confirm("Are you sure you want to change the password!");
    if(choice){
        router("/change-password");
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profilePage">

      {/* HEADER */}

      <div className="profileTopBar">

        <button
          className="backBtn"
          onClick={() => router("/home")}
        >
          <FaArrowLeft />
          Back
        </button>

        <h1>My Profile</h1>

      </div>

      {/* HERO */}

      <div className="profileHero">

        <div className="avatar">
          <FaUserCircle />
        </div>

        <div className="profileInfo">

          <h1>{userData?.username}</h1>

          <p>MockAI User</p>

          <span>
            Joined {new Date(profile.joined).toLocaleDateString()}
          </span>

        </div>

      </div>

      {/* STATS */}

      <div className="profileStats">

        <div className="profileCard">

          <FaClipboardList className="profileIcon" />

          <h2>{profile.totalInterviews}</h2>

          <p>Total Interviews</p>

        </div>

        <div className="profileCard">

          <FaChartLine className="profileIcon" />

          <h2>{profile.averageScore}%</h2>

          <p>Average Score</p>

        </div>

        <div className="profileCard">

          <FaTrophy className="profileIcon" />

          <h2>{profile.bestScore}%</h2>

          <p>Best Score</p>

        </div>

        <div className="profileCard">

          <FaFire className="profileIcon" />

          <h2>{profile.streak} Days</h2>

          <p>Current Streak</p>

        </div>

      </div>

      {/* ACCOUNT INFO */}

      <section className="profileInfoGrid">

        <div className="infoCard">

          <h2>Account Information</h2>

          <div className="infoRow">

            <span>Username</span>

            <strong>{userData?.username}</strong>

          </div>

          <div className="infoRow">

            <span>Account Type</span>

            <strong>Free User</strong>

          </div>

          <div className="infoRow">

            <span>Member Since</span>

            <strong>
              {new Date(profile.joined).toLocaleDateString()}
            </strong>

          </div>

          <div className="infoRow">

            <span>Pending Interviews</span>

            <strong>{profile.pending}</strong>

          </div>

        </div>

        <div className="statsInfoCard">

          <h2>Interview Summary</h2>

          <div className="statsRow">
            <span>💻 Technical</span>
            <strong>{profile.technical}</strong>
          </div>

          <div className="statsRow">
            <span>👔 HR</span>
            <strong>{profile.hr}</strong>
          </div>

          <div className="statsRow">
            <span>🧠 Mixed</span>
            <strong>{profile.mixed}</strong>
          </div>

          <div className="statsRow">
            <span>🟢 Easy</span>
            <strong>{profile.easy}</strong>
          </div>

          <div className="statsRow">
            <span>🟠 Medium</span>
            <strong>{profile.medium}</strong>
          </div>

          <div className="statsRow">
            <span>🔴 Hard</span>
            <strong>{profile.hard}</strong>
          </div>

        </div>

      </section>

      {/* FAVOURITE ROLE */}

      <section className="favoriteSection">

    <h2>Most Practiced Role</h2>

    <div className="favoriteCard">

        <div className="favoriteIcon">
            💻
        </div>

        <div className="favoriteContent">

            <h3>{profile.favouriteRole}</h3>

            <p>Your most practiced interview role</p>

        </div>

    </div>

</section>
<section className="recentActivity">

    <h2>Recent Activity</h2>

    {
        profile.recent.length === 0 ?

        (
            <div className="activityEmpty">
                No interview completed yet.
            </div>
        )

        :

        (

            profile.recent.map((item)=>(

                <div
                    className="activityCard"
                    key={item.submissionId}
                >

                    <div className="activityLeft">

                        <div className="activityIcon">

                            {
                                item.interview_type==="Technical"
                                ? "💻"
                                : item.interview_type==="HR"
                                ? "👔"
                                : "🧠"
                            }

                        </div>

                        <div>

                            <h3>{item.role}</h3>

                            <p>

                                {new Date(item.date).toLocaleDateString()}

                            </p>

                        </div>

                    </div>

                    <span
                        className={
                            item.score>=90
                            ? "score excellent"

                            : item.score>=75

                            ? "score good"

                            : "score average"
                        }
                    >

                        {item.score}%

                    </span>

                </div>

            ))

        )

    }

</section>

      {/* ACCOUNT */}

      <section className="accountSection">

        <h2>Account</h2>

        <div className="accountGrid">

          <button
            className="settingBtn"
            onClick={()=> handlePasswordChange()}
          >
            Change Password
          </button>

          <button
            className="settingBtn logoutBtn" onClick={()=> handleLogout()}
          >
            Logout
          </button>

        </div>

      </section>

    </div>
  );
}

export default ProfilePage;