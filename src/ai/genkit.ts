import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { config } from 'dotenv';

// Load environment variables from .env file before anything else.
config();

// Initialize Genkit and the Google AI plugin with the API key.
// The API key is now reliably read from process.env after dotenv.config() is called.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
