"use client";

import { useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewsOverview() {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGetSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news-summary");
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Failed to get news summary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "hover:bg-transparent hover:text-yellow-500",
            loading && "cursor-wait"
          )}
          onClick={handleGetSummary}
          disabled={loading}
        >
          <Newspaper className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] bg-gray-800 border-gray-600"
        align="end"
      >
        <div className="space-y-2">
          <h3 className="text-base font-medium text-gray-100">Trending News</h3>
          {loading ? (
            <p className="text-sm text-gray-400">
              AI summarizing market news...
            </p>
          ) : (
            <div className="max-h-[420px] overflow-auto pr-2">
              <div className="text-sm text-gray-300 whitespace-pre-line">
                {summary || "Click to get latest market summary"}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
