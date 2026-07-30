import React, { useState } from "react";
import "../styles/changePassword.css";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePassword() {

    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleChangePassword = async (e) => {

    e.preventDefault();

    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {

        alert("Please fill all fields.");
        return;

    }

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match.");
        return;

    }

    try {

        const token = localStorage.getItem("token");

        const response = await axios.put(

            "https://ai-mock-interview-sandy-gamma.vercel.app/api/v1/users/change-password",

            {
                currentPassword,
                newPassword
            },

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        alert(response.data.message);

        navigate("/profile");

    }

    catch(err){

        console.log(err);

    console.log(err.response);

    console.log(err.response?.data);

    alert(
        err.response?.data?.message ||
        "Something went wrong"
    );

    }

};

    return (

        <div className="changePage">

            <div className="changeCard">

                <button
                    className="backBtn"
                    onClick={() => navigate("/profile")}
                >
                    <FaArrowLeft />
                    Back
                </button>

                <div className="lockCircle">

                    <FaLock />

                </div>

                <h1>Change Password</h1>

                <p>
                    Update your account password to keep your account secure.
                </p>

                <form onSubmit={handleChangePassword}>

                    <div className="inputGroup">

                        <label>Current Password</label>

                        <input
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(e.target.value)
                            }
                        />

                    </div>

                    <div className="inputGroup">

                        <label>New Password</label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                        />

                    </div>

                    <div className="inputGroup">

                        <label>Confirm Password</label>

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                        />

                    </div>

                    <button type="submit" className="changeBtn">

                        Change Password

                    </button>

                </form>

            </div>

        </div>

    );
}

export default ChangePassword;