import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize Genkit and the Google AI plugin.
// The googleAI() plugin will automatically look for the GEMINI_API_KEY 
// in the process.env, which is made available by Next.js configuration.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
