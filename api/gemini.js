// This imports the necessary library to talk to Google's AI
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: This line tells the code to get your API key from Vercel's settings
// It's NEVER hardcoded here for security!
const API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Gemini AI with your key
const genAI = new GoogleGenerativeAI(API_KEY);

// This is the function that Vercel will run when your webpage requests it
export default async function handler(req, res) {
  // Only allow "POST" requests (when your button is clicked)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Get the question (prompt) that came from your webpage
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required.' });
    }

    // Tell it to use the 'gemini-pro' model (a powerful text model)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Send the prompt to Gemini and wait for the result
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); // Get the plain text answer

    // Send the AI's answer back to your webpage
    res.status(200).json({ text: text });
  } catch (error) {
    // If anything goes wrong, send an error message back
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Error interacting with Gemini API', error: error.message });
  }
}
