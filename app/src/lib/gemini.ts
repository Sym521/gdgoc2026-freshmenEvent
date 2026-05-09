import { GoogleGenerativeAI } from '@google/generative-ai';

// APIキーを環境変数から取得
const apiKey = process.env.GEMINI_API_KEY || '';

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(apiKey);

// 使用するモデルを指定 (gemini-2.5-flash)
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});
