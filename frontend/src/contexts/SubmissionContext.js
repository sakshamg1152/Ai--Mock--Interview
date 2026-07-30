import { createContext, useContext} from "react";
import axios from 'axios'; 
export  const SubmissionContext = createContext({}); 

const client = axios.create({
    baseURL: "https://ai-mock-interview-sandy-gamma.vercel.app/api/submission"
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