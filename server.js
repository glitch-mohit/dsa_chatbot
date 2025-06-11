require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Restrict CORS to localhost for development and your Vercel domain in production
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-project.vercel.app'], // Replace with your Vercel URL after deployment
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files (index.html)
app.use(express.static(path.join(__dirname)));

// Ensure index.html is served for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Please provide a question' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: `You are a Data Structure and Algorithm Instructor. You only reply to questions related to coding, data structures, or algorithms. Explain in simple terms. For non-coding questions, reply rudely: "You dumb, ask me coding questions only!"`
        });

        const result = await model.generateContent(question);
        const response = await result.response;
        const text = response.text();

        res.json({ answer: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});