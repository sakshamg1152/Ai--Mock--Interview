import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateQuestions = async (
    role,
    experience,
    difficulty,
    interviewType,
    numberOfQuestions
) => {

    try{

        const prompt = `
You are an expert technical interviewer.

Generate exactly ${numberOfQuestions} interview questions.

Role: ${role}
Experience: ${experience}
Difficulty: ${difficulty}
Interview Type: ${interviewType}

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT use markdown.
3. Do NOT wrap the JSON inside \`\`\`json.
4. Return ONLY a JSON array.
5. Every object must contain ONLY ONE field:
   - question
6. Do NOT include id.
7. Do NOT include difficulty.
8. Do NOT include focus.
9. Do NOT include explanation.
10. Do NOT include any text before or after the JSON.

Example Output:

[
    {
        "question":"Explain Virtual DOM in React."
    },
    {
        "question":"What is useEffect?"
    },
    {
        "question":"Explain React.memo."
    }
]
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;

    }
    catch(err){

        console.log(err);

        throw err;

    }

};

export { generateQuestions };