import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsArticle } from "../transformers";
import { formatRelativeTime } from "./helpers";

interface ActiveNewsPanelProps {
  articles: NewsArticle[];
}

export const ActiveNewsPanel = ({ articles }: ActiveNewsPanelProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeIndex = Math.min(currentIndex, Math.max(0, articles.length - 1));

  const currentArticle = articles[safeIndex];

  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));
  
  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, articles.length - 1));

  const atStart = safeIndex === 0;
  const atEnd = safeIndex >= articles.length - 1;

  return (
    <div className="card bg-base-200 h-full overflow-hidden">
      <div className="card-body p-0 flex flex-col h-full">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h2 className="card-title text-sm">Headlines</h2>
          <div className="flex items-center gap-2">
            <span className="badge badge-sm badge-ghost">
              {articles.length === 0 ? "0" : `${safeIndex + 1} / ${articles.length}`}
            </span>
            <button
              onClick={goPrev}
              disabled={atStart || articles.length === 0}
              className="btn btn-circle btn-ghost btn-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              disabled={atEnd || articles.length === 0}
              className="btn btn-circle btn-ghost btn-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!currentArticle ? (
          <div className="flex-1 flex items-center justify-center opacity-60 text-sm">
            Headlines have not loaded in as of yet.
          </div>
        ) : (
          <div className="flex-1 p-3 overflow-auto">
            <div className="card bg-base-100 w-full">
              <div className="card-body">
                <div className="flex items-center justify-between text-xs opacity-60">
                  <span>{currentArticle.source}</span>
                  <span>{formatRelativeTime(currentArticle.timestamp)}</span>
                </div>
                <h3 className="card-title text-lg leading-tight">
                  {currentArticle.headline}
                </h3>
                <p className="text-sm opacity-80">
                  {currentArticle.summary}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveNewsPanel;
