import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure backend .env is loaded regardless of current working directory
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Validates and initializes the Google Generative AI client.
 * Returns null if GEMINI_API_KEY is missing or unconfigured.
 */
export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('[Gemini Init Error]:', err.message);
    return null;
  }
};

/**
 * Returns a configured Gemini generative model instance.
 * Default model: 'gemini-3.1-flash-lite' (or specified via GEMINI_MODEL env)
 */
export const getGeminiModel = (
  modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
  generationConfig = { responseMimeType: 'application/json' }
) => {
  const client = getGeminiClient();
  if (!client) return null;

  try {
    return client.getGenerativeModel({
      model: modelName,
      generationConfig,
    });
  } catch (err) {
    console.warn(`[Gemini Model Error (${modelName})]:`, err.message);
    return null;
  }
};

export default getGeminiClient;

