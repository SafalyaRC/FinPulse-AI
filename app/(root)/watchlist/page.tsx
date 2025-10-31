import { Star } from "lucide-react";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import SearchCommand from "@/components/ui/SearchCommand";
import { getWatchlistWithData } from "@/lib/actions/watchlist.action";
import { WatchlistTable } from "@/components/ui/WatchlistTable";

import AlertsList from "@/components/ui/AlertsList";
import { getUserAlerts } from "@/lib/actions/alert.actions";

const Watchlist = async () => {
  const [watchlist, alerts, initialStocks] = await Promise.all([
    getWatchlistWithData(),
    getUserAlerts(),
    searchStocks(),
  ]);

  // Empty state
  if (watchlist.length === 0) {
    return (
      <section className="flex watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Start building your watchlist by searching for stocks and clicking
            the star icon to add them.
          </p>
        </div>
        <SearchCommand initialStocks={initialStocks} />
      </section>
    );
  }

  return (
    <div className="watchlist-container">
      <section className="watchlist">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="watchlist-title">Watchlist</h2>
            <SearchCommand initialStocks={initialStocks} />
          </div>
          <WatchlistTable watchlist={watchlist} />
        </div>
      </section>

      <section className="watchlist-alerts">
        <div className="flex flex-col gap-4">
          <h2 className="watchlist-title">Price Alerts</h2>
          <AlertsList alertData={alerts} />
        </div>
      </section>
    </div>
  );
};

export default Watchlist;
