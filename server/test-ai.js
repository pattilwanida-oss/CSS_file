import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

async function testAPI() {
  console.log("Testing API Key:", process.env.GEMINI_API_KEY);
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Hello, this is a test. Reply with 'OK' if you receive this.",
    });
    console.log("Response from Gemini:", response.text);
    console.log("✅ API KEY IS WORKING!");
  } catch (e) {
    console.error("❌ API KEY TEST FAILED:");
    console.error(e.message);
  }
}

testAPI();
