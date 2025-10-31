import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "finpulse",
  ai: { gemini: { apiKey: process.env.GEMINI_API_KEY } },
});
