import { Heart, Repeat2, BadgeCheck } from "lucide-react";
import type { Tweet } from "../transformers";
import { formatCount, formatRelativeTime } from "./helpers";

interface TwitterSidebarProps {
  tweets: Tweet[];
}


export const TwitterSidebar = ({ tweets }: TwitterSidebarProps) => {
  return (
    <div className="card bg-base-200 h-full overflow-hidden">
      <div className="card-body p-0 flex flex-col h-full">
        <h2 className="card-title px-4 pt-3 pb-2 text-sm">
          <span className="badge badge-sm badge-ghost">Twitter</span>
        </h2>

        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="card card-compact bg-base-100">
              <div className="card-body">
                <div className="flex items-start gap-2">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={tweet.author.avatarUrl} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-bold truncate">{tweet.author.name}</span>
                      {tweet.author.verified && <BadgeCheck className="w-3 h-3" />}
                      <span className="opacity-60">·</span>
                      <span className="opacity-60">{formatRelativeTime(tweet.timestamp)}</span>
                    </div>
                    <p className="text-sm mt-1 line-clamp-3">{tweet.content}</p>
                    <div className="flex gap-3 mt-2 text-xs opacity-70">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {formatCount(tweet.stats.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="w-3 h-3" /> {formatCount(tweet.stats.retweets)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwitterSidebar;
