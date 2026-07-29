import { createContext, useContext, useState } from "react";
import axios from 'axios';
import httpStatus from 'http-status'; 
import { useNavigate } from 'react-router-dom';
export  const SubmissionContext = createContext({}); 

const client = axios.create({
    baseURL: "https://ai-mock-interview-code-arena.vercel.app/api/submission"
})

export const SubmissionProvider = ({children}) =>{

    const answerCheckingF  = async(id,questions , answer) =>{
        try{
            const token = localStorage.getItem("token");
            let request = await client.post(
                "/answer",
                {
                    id: id,
                    question: questions,
                    answer_array: answer
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("REQUEST DATA : ",request.data)
            if (request.status >= 200 && request.status < 300) {
                return request.data;
            }

        }catch(e){
            throw e;
        }

    }
    const data={
        answerCheckingF
    }
    return (
        <SubmissionContext.Provider value={data}>
            {children}
        </SubmissionContext.Provider>
    )
}

export const useSubmission = () => {
    return useContext(SubmissionContext);
}