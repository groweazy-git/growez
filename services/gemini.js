const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const pillars = {
  1: "Monday Motivation — Inspire them to start the week strong",
  2: "Tuesday Tip — One practical fitness or health tip",
  3: "Wednesday Offer — Promote current gym offer or free trial",
  4: "Thursday Transformation — Member result or progress story",
  5: "Friday Energy — High energy post to finish the week strong",
  6: "Saturday Challenge — Weekend workout challenge for members",
  0: "Sunday Recovery — Rest, recovery and mindset tip",
};

const generatePost = async (business) => {
  const day = new Date().getDay();
  const pillar = pillars[day];

  const prompt = `
You are a social media manager for a local gym in India.

Business Details:
- Gym Name: ${business.name}
- City: ${business.city}
- Trainer/Owner Name: ${business.trainer_name}
- Current Offer: ${business.offer}
- Tone: ${business.tone}

Today's Content Focus: ${pillar}

Instructions:
- Write 1 Instagram caption (max 150 words)
- Make it feel human, local and authentic
- Reference the gym name and city naturally
- End with exactly 5 relevant hashtags
- Do NOT use generic AI sounding phrases
- Do NOT use words like "unleash", "embark", "dive in"
- Keep it conversational and energetic
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// TEMPORARY TEST — remove after confirming
const { getActiveBusinesses } = require("./supabase");
const { logContent } = require("./supabase");

const testRun = async () => {
  const businesses = await getActiveBusinesses();
  for (const business of businesses) {
    const post = await generatePost(business);
    await logContent(business.id, post);
    console.log(`\n✅ ${business.name}:\n${post}`);
  }
};

testRun();

module.exports = { generatePost };
