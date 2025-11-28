import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
})

export async function summarizePage(text: string) {
    const prompt = `
        Summarize the content of this webpage in 2–3 sentences.
        Also generate 3-5 relevant tags/categories for this page.
        Return the tags only as a JSON array like ["tech","ai","programming"].
        Webpage content: ${text}
    `;
    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const fullText = response.text!;
    const tagMatch = fullText.match(/```json\s*\n*(\[.*\])\n*```/s);
    let tags: string[] = [];

   
    if (tagMatch && tagMatch[1]) {
        try {
        tags = JSON.parse(tagMatch[1]);
        } catch (err) {
        console.error("Failed to parse tags:", err);
        }
    }
       

    const summary = fullText.replace(/```json[\s\S]*```/g, "").trim();
    console.log({
        summary,
        tags
    })

    return {
        summary,
        tags
    };
}
export async function generateTitle(text: string) {
    const prompt = `
        Analyze the following webpage content and generate a short, human-readable title in 2–3 words. 
        The title should reflect the main topic of the page and be suitable as a bookmark title. 
        Examples: "React Docs", "Tailwind CSS", "Frontend Mentor", "Substack Article", "MDN Web Docs".
        Webpage content: ${text}
        Return only the title, nothing else.
        Keep the title concise, capitalized properly, and free of punctuation or extra words.
        If the content is broad, pick the most relevant 2–3 words representing the topic.
    `;
    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const fullText = response.text!;

    return fullText;
}

export async function analyzePage(text: string) {
    const prompt = `
        Analyze the following webpage content.
        Return a JSON object with:
    
        {
          "title": "...",
          "summary": "...",
          "tags": ["...", "..."]
        }
        
        The title should reflect the main topic of the page and be suitable as a bookmark title. It should be a short, human-readable title in 2–3 words.. 
        Examples: "React Docs", "Tailwind CSS", "Frontend Mentor", "Substack Article", "MDN Web Docs". Keep the title concise, capitalized properly, and free of punctuation or extra words.

        The summary should be in 2–3 short sentences sentences.
        The tags should be no more 3.

    
        Content:
        ${text}
      `
    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    console.log(response.text);
    const raw = response.text || '';
    const cleaned = raw
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();
    return JSON.parse(cleaned || '');
  }
  