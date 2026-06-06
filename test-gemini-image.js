const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(Object.keys(genAI));
console.log(Object.keys(genAI.getGenerativeModel({model: "gemini-1.5-flash"})));
