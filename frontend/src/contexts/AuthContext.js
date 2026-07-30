import { createContext, useContext, useState } from "react";
import axios from 'axios';
import httpStatus from 'http-status'; 
import { useNavigate } from 'react-router-dom';
export  const AuthContext = createContext({}); 

const client = axios.create({
    baseURL: "https://ai-mock-interview-sandy-gamma.vercel.app/api/v1/users"
})

export const AuthProvider = ({children}) =>{

    const [userData, setUserData] = useState(() => {
        return JSON.parse(localStorage.getItem("userData")) || null;
    });
    const handleRegister = async (name , username , password) =>{
        try{
            let request = await client.post("/register" , {
                name:name,
                username:username,
                password : password
            })

            if(request.status===httpStatus.CREATED){
                return request.data.message;
            }

        }catch(err){
            throw err;
        }
    }

    const handleLogin = async (username , password) =>{
        try{
            let request = await client.post("/login" , {
                username:username,
                password : password
            })
            
            // Change this in AuthContext.jsx
            if (request.status >= 200 && request.status < 300) {
                localStorage.setItem("token", request.data.token);
                localStorage.setItem("userData", JSON.stringify(request.data.user));
                setUserData(request.data.user); 
                router("/home");
                return request.data.message;
            }

        }catch(err){
            throw err;
        }

        
    }

    const router=useNavigate();

    const data={
        userData , setUserData , handleRegister, handleLogin
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}