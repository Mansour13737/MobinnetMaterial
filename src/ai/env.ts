import {config} from 'dotenv';
config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const GEMINI_API_KEY = getEnv('GEMINI_API_KEY');
