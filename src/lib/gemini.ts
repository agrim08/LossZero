import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateStudyHint(
  topicsToday: string[],
  streak: number,
  lastNote: string,
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      User is learning Machine Learning in a 3-month curriculum.
      Today they completed these topics: ${topicsToday.join(", ")}.
      Their current study streak is ${streak} days.
      Their last study note was: "${lastNote}".

      Provide three things exactly in this JSON format:
      {
        "motivation": "A single short, sharp, technical, and deeply motivating sentence.",
        "summary": "A quick and simple yet effective one-sentence summary of what the user learned today.",
        "next_suggestion": "The title of a logical next topic or concept the user should study, based on today's work."
      }
      
      Rules:
      - No emojis.
      - Technical and clean tone.
      - Strict brevity.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from potential markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Invalid Gemini response format");
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      motivation: "Keep pushing forward, consistency is the key to mastery.",
      summary: "Completed today's machine learning study session.",
      next_suggestion: "Continue exploring more advanced concepts.",
    };
  }
}

export async function generateTopicNote(topicTitle: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      Create an in-depth, high-level technical study note (aim for approximately 250-300 words) for the ML topic: "${topicTitle}".
      Provide key concepts, mathematical intuition if applicable, and practical implementation tips.
      Format it as a clean technical briefing. Plain text only, no markdown, no emojis.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Note Error:", error);
    return `In-depth study session on ${topicTitle} completed. The technical briefing covered the core mechanics and implementation strategies for this module.`;
  }
}
