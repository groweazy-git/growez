const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Helper function to extract JSON from Gemini response
const extractJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start === -1 || end === -1) return null;
      return JSON.parse(text.slice(start, end + 1));
    } catch (fallbackErr) {
      console.error("JSON parse error on fallback:", fallbackErr);
      return null;
    }
  }
};

const extractJSONArray = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    try {
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      if (start === -1 || end === -1) return null;
      return JSON.parse(text.slice(start, end + 1));
    } catch (fallbackErr) {
      console.error("JSON array parse error on fallback:", fallbackErr);
      return null;
    }
  }
};

router.post("/generate", async (req, res) => {
  const { niche, city, tone, offer, goal } = req.body;
  try {
    const prompt = `You are an expert social media manager. Generate a content plan for a ${niche} business in ${city}. The primary marketing goal is ${goal || 'Brand Awareness'}. The tone should be ${tone}. Main offer: ${offer}. 
    Return ONLY a JSON object with the following structure:
    {
      "feedPosts": [{"idea": "string", "caption": "string", "hashtags": ["string"]}],
      "storyIdeas": [{"idea": "string"}],
      "reelScripts": [{"hook": "string", "script": "string", "cta": "string"}],
      "hooks": ["string"],
      "ctas": ["string"]
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    const responseText = result.response.text();
    const data = extractJSON(responseText);

    if (!data) throw new Error("Failed to parse JSON");
    res.json({ success: true, data });
  } catch (error) {
    console.error("Content generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate content" });
  }
});

router.post("/calendar", async (req, res) => {
  const { niche, city, offer } = req.body;
  try {
    const prompt = `Create a 30-day social media calendar for a ${niche} business in ${city}. The main offer is ${offer}.
    Include a mix of 'Educational', 'Promotional', 'Engagement', and 'Testimonial' posts.
    Return ONLY a JSON array of objects representing the calendar:
    [
      { "day": 1, "type": "Educational", "topic": "string", "format": "Reel/Post/Story" }
    ] (Generate exactly 30 days)`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    const responseText = result.response.text();
    const data = extractJSONArray(responseText);

    if (!data) throw new Error("Failed to parse JSON");
    res.json({ success: true, calendar: data });
  } catch (error) {
    console.error("Calendar generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate calendar" });
  }
});

router.post("/lead-gen", async (req, res) => {
  const { niche, city } = req.body;
  try {
    const prompt = `Generate 3 lead generation campaigns for a ${niche} business in ${city}. 
    Include 1 giveaway, 1 referral program, and 1 local event/promotion.
    Return ONLY a JSON object with this structure:
    {
      "giveaway": { "title": "string", "mechanics": "string" },
      "referral": { "title": "string", "reward": "string" },
      "localEvent": { "title": "string", "idea": "string" }
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });
    const responseText = result.response.text();
    const data = extractJSON(responseText);

    if (!data) throw new Error("Failed to parse JSON");
    res.json({ success: true, data });
  } catch (error) {
    console.error("Lead gen error:", error);
    res.status(500).json({ success: false, error: "Failed to generate lead gen ideas" });
  }
});

router.post("/image", async (req, res) => {
  const { prompt } = req.body;
  try {
    const aiPrompt = `You are an expert UI/UX designer. Create a beautiful, modern, minimalist 1024x1024 SVG promotional graphic for the following request: "${prompt}".
    Use elegant Google Fonts, beautiful color gradients, modern abstract geometric shapes if necessary, and well-balanced composition. 
    Return strictly ONLY raw JSON with a single key "svg" containing the raw valid SVG code. No markdown formatting.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    // Convert SVG string to a base64 Data URI so it can be used directly in an <img> tag
    const base64Svg = Buffer.from(data.svg).toString('base64');
    const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate image" });
  }
});

module.exports = router;
