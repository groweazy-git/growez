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

function renderSVGTemplate(data, businessData) {
  const { template_type, headline, subheadline, cta, primary_color, secondary_color } = data;
  const bizName = businessData?.business_name || 'Your Business';
  
  // Default fallbacks if AI fails to provide colors
  const bg = primary_color || '#1A1A2E';
  const accent = secondary_color || '#E94560';

  if (template_type === 'testimonial') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
        <rect width="1024" height="1024" fill="${bg}" />
        <circle cx="512" cy="512" r="400" fill="none" stroke="${accent}" stroke-width="4" opacity="0.2" />
        <text x="512" y="300" font-family="sans-serif" font-size="120" font-weight="bold" fill="${accent}" text-anchor="middle">"</text>
        <text x="512" y="450" font-family="sans-serif" font-size="56" font-style="italic" font-weight="bold" fill="#FFFFFF" text-anchor="middle" width="800">${headline}</text>
        <text x="512" y="600" font-family="sans-serif" font-size="32" fill="#A0A0B0" text-anchor="middle">${subheadline}</text>
        <rect x="362" y="750" width="300" height="80" rx="40" fill="${accent}" />
        <text x="512" y="802" font-family="sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${cta}</text>
        <text x="512" y="950" font-family="sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">${bizName.toUpperCase()}</text>
      </svg>
    `;
  }

  if (template_type === 'educational') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
        <rect width="1024" height="1024" fill="${bg}" />
        <rect x="100" y="100" width="824" height="824" fill="#FFFFFF" rx="40" opacity="0.05" />
        <text x="150" y="250" font-family="sans-serif" font-size="36" font-weight="bold" fill="${accent}" letter-spacing="2">TIP OF THE DAY</text>
        <text x="150" y="400" font-family="sans-serif" font-size="80" font-weight="bold" fill="#FFFFFF">${headline}</text>
        <text x="150" y="520" font-family="sans-serif" font-size="36" fill="#D0D0E0" width="700">${subheadline}</text>
        <rect x="150" y="700" width="280" height="80" rx="16" fill="${accent}" />
        <text x="290" y="752" font-family="sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${cta}</text>
        <text x="850" y="900" font-family="sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="end" letter-spacing="2">${bizName.toUpperCase()}</text>
      </svg>
    `;
  }

  if (template_type === 'gym_offer') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
        <rect width="1024" height="1024" fill="${bg}" />
        <path d="M0 0 L1024 0 L1024 1024 L0 800 Z" fill="#000000" opacity="0.4" />
        <text x="512" y="250" font-family="sans-serif" font-size="110" font-weight="900" font-style="italic" fill="${accent}" text-anchor="middle" letter-spacing="8">${headline.toUpperCase()}</text>
        <text x="512" y="400" font-family="sans-serif" font-size="48" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${subheadline}</text>
        <rect x="262" y="600" width="500" height="120" rx="20" fill="${accent}" />
        <text x="512" y="675" font-family="sans-serif" font-size="42" font-weight="900" fill="#000000" text-anchor="middle" letter-spacing="2">${cta.toUpperCase()}</text>
        <text x="512" y="900" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">${bizName.toUpperCase()}</text>
      </svg>
    `;
  }

  if (template_type === 'salon_promo') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
        <rect width="1024" height="1024" fill="${bg}" />
        <circle cx="512" cy="512" r="450" fill="none" stroke="${accent}" stroke-width="2" opacity="0.3" />
        <circle cx="512" cy="512" r="430" fill="none" stroke="${accent}" stroke-width="1" opacity="0.1" />
        <text x="512" y="380" font-family="sans-serif" font-size="72" font-weight="300" fill="#FFFFFF" text-anchor="middle" letter-spacing="10">${headline.toUpperCase()}</text>
        <text x="512" y="480" font-family="sans-serif" font-size="36" font-style="italic" fill="${accent}" text-anchor="middle">${subheadline}</text>
        <rect x="362" y="650" width="300" height="80" rx="40" fill="none" stroke="${accent}" stroke-width="2" />
        <text x="512" y="700" font-family="sans-serif" font-size="24" font-weight="bold" fill="${accent}" text-anchor="middle" letter-spacing="4">${cta.toUpperCase()}</text>
        <text x="512" y="900" font-family="sans-serif" font-size="24" font-weight="300" fill="#FFFFFF" text-anchor="middle" letter-spacing="8">${bizName.toUpperCase()}</text>
      </svg>
    `;
  }

  if (template_type === 'cafe_menu') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
        <rect width="1024" height="1024" fill="${bg}" />
        <rect x="50" y="50" width="924" height="924" fill="none" stroke="${accent}" stroke-width="8" />
        <rect x="70" y="70" width="884" height="884" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5" />
        <text x="512" y="200" font-family="sans-serif" font-size="40" font-weight="bold" fill="${accent}" text-anchor="middle" letter-spacing="6">TODAY'S SPECIAL</text>
        <line x1="300" y1="240" x2="724" y2="240" stroke="${accent}" stroke-width="2" opacity="0.5" />
        <text x="512" y="450" font-family="sans-serif" font-size="96" font-weight="900" fill="#FFFFFF" text-anchor="middle">${headline}</text>
        <text x="512" y="550" font-family="sans-serif" font-size="36" font-style="italic" fill="#DDDDDD" text-anchor="middle">${subheadline}</text>
        <rect x="362" y="700" width="300" height="80" rx="10" fill="${accent}" />
        <text x="512" y="750" font-family="sans-serif" font-size="28" font-weight="bold" fill="#222222" text-anchor="middle">${cta}</text>
        <text x="512" y="920" font-family="sans-serif" font-size="28" font-weight="bold" fill="${accent}" text-anchor="middle" letter-spacing="4">${bizName.toUpperCase()}</text>
      </svg>
    `;
  }

  // Default: promotion
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#grad1)" />
      <polygon points="0,0 1024,0 1024,300 0,150" fill="${accent}" opacity="0.1" />
      <text x="512" y="350" font-family="sans-serif" font-size="96" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">${headline.toUpperCase()}</text>
      <text x="512" y="450" font-family="sans-serif" font-size="40" font-weight="bold" fill="${accent}" text-anchor="middle">${subheadline}</text>
      <rect x="312" y="600" width="400" height="100" rx="50" fill="${accent}" />
      <text x="512" y="662" font-family="sans-serif" font-size="36" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${cta}</text>
      <line x1="200" y1="850" x2="824" y2="850" stroke="#FFFFFF" stroke-width="2" opacity="0.3" />
      <text x="512" y="920" font-family="sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="6">${bizName.toUpperCase()}</text>
    </svg>
  `;
}

router.post("/image", async (req, res) => {
  const { category, businessData } = req.body;
  try {
    const aiPrompt = `You are an expert graphic designer and copywriter.
    Create structured content for a local business social media graphic.
    
    BUSINESS DETAILS:
    Name: ${businessData?.business_name || 'Your Business'}
    City: ${businessData?.city || 'City'}
    Industry: ${businessData?.industry || 'Local Business'}
    Tone: ${businessData?.brand_tone?.length ? businessData.brand_tone.join(', ') : 'Professional'}
    Goal: ${businessData?.primary_goal?.length ? businessData.primary_goal.join(', ') : 'More Customers'}

    POST CATEGORY: ${category || 'Promotional Offer'}

    INSTRUCTIONS:
    1. Select the best template_type: 'promotion', 'testimonial', 'educational', 'gym_offer', 'salon_promo', or 'cafe_menu'.
    2. Write a short punchy 'headline' (max 5 words).
    3. Write a contextual 'subheadline' (max 10 words).
    4. Write an actionable 'cta' (button text, max 3 words).
    5. ${businessData?.primary_color ? `Use EXACTLY '${businessData.primary_color}' for 'primary_color' and '${businessData.secondary_color}' for 'secondary_color'.` : `Choose a 'primary_color' and 'secondary_color' in Hex format that match the brand tone.`}
    6. Return strictly ONLY raw JSON with this exact structure:
    {
      "template_type": "promotion",
      "headline": "...",
      "subheadline": "...",
      "cta": "...",
      "primary_color": "#...",
      "secondary_color": "#...",
      "ai_prompt": "A short summary of why these choices were made."
    }
    No markdown formatting.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: aiPrompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const responseText = result.response.text();
    const data = extractJSON(responseText);
    
    if (!data) throw new Error("Failed to parse JSON");

    // Engine: Render SVG using AI Content + Node Template
    const svgContent = renderSVGTemplate(data, businessData);

    // Convert SVG string to a base64 Data URI so it can be used directly in an <img> tag
    const base64Svg = Buffer.from(svgContent).toString('base64');
    const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;

    res.json({ success: true, imageUrl, aiPrompt: data.ai_prompt });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate image" });
  }
});

router.post("/analyze", async (req, res) => {
  const { 
    business_name, industry, city, years_in_business, 
    business_stage, primary_goal, followers, posting_frequency, 
    brand_tone, usp 
  } = req.body;

  try {
    const prompt = `You are a world-class Marketing Strategist AI. Analyze this business profile:
    Name: ${business_name}
    Industry: ${industry}
    Location: ${city}
    Years in business: ${years_in_business}
    Stage: ${business_stage}
    Primary Goal: ${primary_goal}
    Social Presence: ${followers} followers, posting ${posting_frequency}
    Brand Tone: ${brand_tone}
    USP: ${usp}

    Provide a comprehensive analysis. Return strictly ONLY a JSON object with this exact structure:
    {
      "scores": {
        "overall": number (0-100),
        "social_presence": number (0-100),
        "lead_gen": number (0-100),
        "consistency": number (0-100),
        "growth_potential": number (0-100)
      },
      "insight": "string (A 2-sentence personalized insight based on their data)",
      "todays_content": {
        "feed_post": { "idea": "string", "caption": "string", "hashtags": ["string"] },
        "story": { "idea": "string" },
        "reel": { "hook": "string", "script": "string", "cta": "string" },
        "promotion": "string (A specific lead generation or promotional campaign idea)",
        "first_poster": {
          "template_type": "promotion",
          "headline": "string (max 5 words)",
          "subheadline": "string (max 10 words)",
          "cta": "string (max 3 words)",
          "primary_color": "#HEX",
          "secondary_color": "#HEX"
        }
      }
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const responseText = result.response.text();
    const data = extractJSON(responseText);

    if (!data) throw new Error("Failed to parse JSON");

    // Engine: Render First Poster if AI generated it
    if (data.todays_content && data.todays_content.first_poster) {
      const svgContent = renderSVGTemplate(data.todays_content.first_poster, req.body);
      const base64Svg = Buffer.from(svgContent).toString('base64');
      data.todays_content.first_poster.imageUrl = `data:image/svg+xml;base64,${base64Svg}`;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("Analysis generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate marketing analysis" });
  }
});

router.post("/lead-magnet", async (req, res) => {
  const { businessData } = req.body;
  try {
    const prompt = `You are a world-class marketer. Generate a complete Lead Magnet outline for a local business to use to capture emails/phone numbers.
    
    BUSINESS:
    Name: ${businessData?.business_name}
    Industry: ${businessData?.industry}
    Goal: ${businessData?.primary_goal}
    
    Return ONLY JSON:
    {
      "title": "e.g. 7-Day Free Trial Pass",
      "subtitle": "e.g. Claim your pass and transform your fitness",
      "type": "PDF Guide | Coupon | Free Pass | Video Course",
      "hook": "Why they should download it",
      "outline": [
        "Point 1", "Point 2", "Point 3"
      ],
      "capture_fields": ["Name", "Email", "Phone"]
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const responseText = result.response.text();
    const data = extractJSON(responseText);

    if (!data) throw new Error("Failed to parse JSON");
    res.json({ success: true, leadMagnet: data });
  } catch (error) {
    console.error("Lead Magnet generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate lead magnet" });
  }
});

module.exports = router;
