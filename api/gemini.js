// This imports the necessary library and GenerativeModel class
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com';

const genAI = new GoogleGenerativeAI(API_KEY, { baseUrl: BASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required.' });
    }

    // --- !!! NEW CHANGE STARTS HERE !!! ---
    // Use the full model resource name which is sometimes more robust
    const model = new GenerativeModel(genAI, { model: 'models/gemini-pro' });
    // --- !!! NEW CHANGE ENDS HERE !!! ---

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Error interacting with Gemini API', error: error.message });
  }
}
