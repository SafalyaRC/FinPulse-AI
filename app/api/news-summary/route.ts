import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getNews } from "@/lib/actions/finnhub.actions";

export async function GET() {
  try {
    // Try to fetch live top market news (uses Finnhub via existing helper)
    let topStories = [] as { headline?: string }[];
    try {
      // getNews returns formatted MarketNewsArticle[]; pass no symbols to get general market news
      const articles = await getNews();
      if (Array.isArray(articles) && articles.length > 0) {
        // Keep up to 6 articles but we will summarize the top 4
        topStories = articles
          .slice(0, 6)
          .map((a) => ({ headline: a.headline }));
      }
    } catch (err) {
      console.warn(
        "getNews failed, will allow Gemini to generate headlines:",
        err
      );
      topStories = [];
    }

    // If we have no live stories, we'll ask Gemini to generate fresh headlines itself
    const haveLive = topStories.length > 0;
    const newsText = haveLive
      ? topStories.map((s) => s.headline || "").join("\n")
      : "";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = haveLive
      ? `Summarize these market headlines into 3-4 key bullet points highlighting the most important market impacts and trends. Focus on the implications for investors:\n\n${newsText}`
      : `Generate 3-4 concise, realistic market headlines about today's market movers, then summarize the combined implications into 3-4 key bullet points for investors. Provide the generated headlines followed by the bullets.`;

    const result = await model.generateContent(prompt);
    // result.response.text() may be async depending on SDK; handle safely
    let text: string = "";
    try {
      // If the SDK returns a Response-like object with text() method
      if (result?.response && typeof result.response.text === "function") {
        // @ts-ignore
        text = await result.response.text();
      } else if (typeof result === "string") {
        text = result;
      } else if (result != null) {
        try {
          text = JSON.stringify(result);
        } catch (e) {
          text = String(result);
        }
      }
    } catch (err) {
      console.error("Failed to read model response text:", err);
      text = "";
    }

    // --- Sanitize / normalize the summary for UI display ---
    // 1) Remove any leading sentence like "Here's a summary...for investors:" or generic leading summary lines
    // Remove lines that explicitly mention 'summary' or start with 'here' (case-insensitive)
    text = text.replace(/^(?:.*summary.*|here[^\n]*)(?:\r?\n)+/i, "");

    // 2) Strip markdown bold/italic markers (**, __, *, _)
    text = text
      .replace(/\*\*/g, "")
      .replace(/__+/g, "")
      .replace(/\*/g, "")
      .replace(/_/g, "");

    // 3) Normalize list markers to a single bullet character
    text = text.replace(/^\s*[\-\*\u2022]\s*/gm, "• ");

    // 4) Collapse excessive blank lines
    text = text.replace(/\n{3,}/g, "\n\n");

    // 5) Trim surrounding whitespace
    text = text.trim();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("Error generating news summary:", error);
    return NextResponse.json(
      { error: "Failed to generate news summary" },
      { status: 500 }
    );
  }
}
