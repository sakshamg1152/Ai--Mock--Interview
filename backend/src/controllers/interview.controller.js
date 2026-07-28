import {Interview} from "../models/interview.model.js";
import httpStatus from "http-status";
import { generateQuestions } from "../Node.js";

const createInterview = async(req,res) =>{
    console.log("REQ BODY:", req.body);
    console.log(req.user);
    const {role,difficulty,experience,no_of_questions,interview_type} = req.body;
    console.log("Calling Gemini...");
    const response = await generateQuestions(role,experience,difficulty,interview_type,no_of_questions);
    console.log("Gemini Response:");
    console.log(response);
    const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
    const parsed = JSON.parse(cleanedResponse);
    const questions_array = parsed;
    console.log("Parsed Successfully");
    console.log("question_array : " , questions_array);
    
    try{
        const newInterview = new Interview({
            userId:req.user._id,
            role : role,
            difficulty: difficulty,
            experience : experience,
            no_of_questions : no_of_questions,
            interview_type : interview_type,
            questions : questions_array
        });
        await newInterview.save();
        console.log("Saved Interview:");
        console.log(newInterview);
        const check = await Interview.findById(newInterview._id);
        console.log(check);
        res.status(httpStatus.CREATED).json({
            message : "Inrerview Registered",
            interview: newInterview
        });
    }catch(e){
        return res.status(400).json({message : `Something went wrong ${e}`});
    }
        
}

const getAllInterviews = async(req,res) =>{
    try{
        const interviews = await Interview.find();
        res.status(httpStatus.OK).json({
            success:true,
            interviews
        });

    }catch(e){
        res.status(404).json({
            success : false,
            message : e.message
        })

    }
}

const getInterviewById = async(req,res) =>{
    try{
        const interview = await Interview.findById(req.params.id);
        res.status(httpStatus.OK).json({
            success:true,
            interview
        });

    }catch(e){
        res.status(404).json({
            success : false,
            message : e.message
        })

    }
}

const searchInterview = async (req, res) => {
    try {

        const { role } = req.query;

        const interviews = await Interview.find({
            userId: req.user.id,
            role: {
                $regex: role,
                $options: "i"
            }
        });

        res.json({
            success: true,
            interviews
        });

    } catch (e) {

        res.status(400).json({
            success: false,
            message: e.message
        });

    }
};

export {
    createInterview,
    getAllInterviews,
    getInterviewById,
    searchInterview
};

