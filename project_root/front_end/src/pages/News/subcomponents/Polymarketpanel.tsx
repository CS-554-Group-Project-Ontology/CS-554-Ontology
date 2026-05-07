import { TrendingUp, TrendingDown } from "lucide-react";
import type { PolymarketRow } from "../transformers";
import { formatCount } from "./helpers";

interface PolymarketPanelProps {
  events: PolymarketRow[];
}

export const PolymarketPanel = ({ events }: PolymarketPanelProps) => {
  return (
    <div className="card bg-base-200 h-full overflow-hidden">
      <div className="card-body p-0 flex flex-col h-full">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h2 className="card-title text-sm">Prediction Markets</h2>
          <span className="badge badge-sm badge-ghost">Polymarket</span>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="table table-zebra table-sm">
            <thead>
              <tr>
                <th>Market</th>
                <th className="text-right">Yes</th>
                <th className="text-right">24h</th>
                <th className="text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="hover">
                  <td className="max-w-xs">{event.question}</td>
                  <td className="text-right font-mono">
                    {(event.yesPrice * 100).toFixed(0)}¢
                  </td>
                  <td className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs ${
                        event.change24h >= 0 ? "text-success" : "text-error"
                      }`}
                    >
                      {event.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {event.change24h >= 0 ? "+" : ""}
                      {event.change24h.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right text-xs opacity-70">
                    ${formatCount(event.volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PolymarketPanel;
