import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const answer_checking = async (id, questions, answers) => {
    try {
        let interviewText = "";

        for (let i = 0; i < questions.length; i++) {
            interviewText += `
Question ${i + 1}:
${questions[i].question}

Candidate Answer:
${answers[i]}
`;
        }

        const prompt = `
You are an experienced software engineering interviewer.

Evaluate the following mock interview.

${interviewText}

For EACH question, calculate a score out of 10 and provide a concise, accurate correct answer. 
Keep your 'correct_answer' explanations straightforward and professional to ensure proper formatting limits are respected.
`;

        // Define a strict schema so the API guarantees valid JSON structure
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                question_results: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question_number: { type: Type.INTEGER },
                            score: { type: Type.INTEGER },
                            correct_answer: { type: Type.STRING },
                        },
                        required: ["question_number", "score", "correct_answer"],
                    },
                },
                overall_score: { type: Type.NUMBER },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                final_feedback: { type: Type.STRING },
            },
            required: ["question_results", "overall_score", "strengths", "weaknesses", "final_feedback"],
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                // Enforce direct JSON generation
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                // Expand token allocation to maximum boundary for generation safety
                maxOutputTokens: 8192, 
            }
        });

        // Safety verification: Ensure data arrived
        if (!response.text) {
            throw new Error("No payload text returned from the AI model.");
        }

        // Directly parse. No regex cleaning required because markdown wrappers are turned off natively.
        const parsed = JSON.parse(response.text);
        return parsed;

    } catch (e) {
        console.error("Gemini Error:", e);
        throw e;
    }
};

export { answer_checking };