const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `Create a beautiful, modern, minimalist 1024x1024 SVG promotional graphic for: "A luxurious Salon offer graphic with elegant script text and glowing aesthetic". 
  Use elegant fonts, gradients, and well-balanced composition. Return strictly ONLY raw JSON with a single key "svg" containing the raw SVG code.`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" }
  });
  
  console.log(result.response.text());
}
run();
