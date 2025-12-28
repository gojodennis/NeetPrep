
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateStudyPlan = async (apiKey, inputs) => {
    if (!apiKey) {
        throw new Error("API Key is missing. Please configure it in Settings.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
        You are an expert NEET exam study planner. Create a 7-day study schedule for a student with the following profile:
        - Daily Study Hours: ${inputs.dailyHours}
        - Focus Area (Weakness): ${inputs.focusArea}
        - Target: NEET Exam
        
        Use the following constraints:
        1. Subjects: Physics, Chemistry, Biology.
        2. Break sessions into manageable chunks.
        
        Return the response strictly as a VALID JSON object with this exact structure:
        {
            "hours": ${inputs.dailyHours},
            "focus": "${inputs.focusArea}",
            "schedule": [
                {
                    "day": "Day 1 (Monday)",
                    "sessions": [
                        { "subject": {"code": "phys", "name": "Physics"}, "duration": 2, "chapter": "Rotational Motion" },
                        ...
                    ]
                },
                ... for 7 days
            ]
        }
        Do not include markdown code block formatting like \`\`\`json. Return raw JSON only. No preamble or explanation.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present just in case
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("AI Generation Error:", error);
        // Pass the actual error message to the UI
        throw new Error(error.message || "Failed to generate plan. Check your API Key or try again.");
    }
};
