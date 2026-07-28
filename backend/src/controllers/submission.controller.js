import {Submission} from "../models/submission.model.js";
import httpStatus from "http-status";
import { answer_checking } from "../Node2.js";

const answerChecking = async(req,res) =>{

    const {id , question , answer_array} = req.body;
    console.log(question)
    console.log(answer_array)
    const response = await answer_checking(id, question , answer_array);
    const answer_response = response;
    console.log(answer_response);
    try{
        const answers = []
        for(let i=0 ; i<question.length ; i++){
            let obj = {
                question : question[i].question,
                answer :  answer_array[i],
                score : answer_response.question_results[i].score,
                correct_answer : answer_response.question_results[i].correct_answer,
            }
            answers.push(obj);
        }

        const newSubmission = new Submission({
            interviewId: id,
            userId: req.user._id,
            answers : answers,
            overallScore : Number(answer_response.overall_score),
            strengths : answer_response.strengths,
            weaknesses : answer_response.weaknesses,
            final_feedback : answer_response.final_feedback,
        });

        await newSubmission.save();
        res.status(httpStatus.CREATED).json({
            message : "Submission Registered",
            submission: newSubmission
        });

    }catch(e){
        return res.status(400).json({
            message : `Something went wrong ${e}`
        });
    }

}

const getSubmissionById = async(req,res) =>{
    try{
        const submission = await Submission.findById(req.params.id);
        res.status(httpStatus.OK).json({
            success:true,
            submission
        });

    }catch(e){
        res.status(404).json({
            success : false,
            message : e.message
        })

    }
}


export {answerChecking , getSubmissionById};