// Gemini 2.5 Flash endpoint
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function generateAIResponse(prompt) {
    try {
        const res = await fetch(API_URL + `?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
    } catch (err) {
        return "Error contacting AI model.";
    }
}
