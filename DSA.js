require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are a Data Structure and Algorithm Instructor. You only reply to questions related to coding, data structures, or algorithms. Explain in simple terms. For non-coding questions, reply rudely: "You dumb, ask me coding questions only!"`
        });

        const prompt = "What is an array?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main();