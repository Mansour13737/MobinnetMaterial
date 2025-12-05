import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { config } from 'dotenv';

// Load environment variables from .env file before anything else.
config();

// Initialize Genkit and the Google AI plugin.
// The API key is now reliably read from process.env after dotenv.config() is called.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
