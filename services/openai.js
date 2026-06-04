const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0].message.content;
};

module.exports = { generatePost };
