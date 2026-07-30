import { createContext, useContext } from "react";
import axios from 'axios';
import httpStatus from 'http-status'; 
export  const InterviewContext = createContext({}); 

const client = axios.create({
    baseURL: "https://ai-mock-interview-sandy-gamma.vercel.app/api/interview"
})

export const InterviewProvider = ({children}) =>{

    const createInterviewF  = async(role,questions,experience,interviewType,difficulty) =>{
        try{
            const token = localStorage.getItem("token");
            let request = await client.post("/create" , 
                {
                role : role,
                difficulty: difficulty,
                experience : experience,
                no_of_questions : questions,
                interview_type : interviewType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
        );

            if(request.status===httpStatus.CREATED){
                return request.data;
            }

        }catch(e){
            throw e;

        }

    }
    const data={
        createInterviewF
    }
    return (
        <InterviewContext.Provider value={data}>
            {children}
        </InterviewContext.Provider>
    )
}

export const useInterview = () => {
    return useContext(InterviewContext);
}