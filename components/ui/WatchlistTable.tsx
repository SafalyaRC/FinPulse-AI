"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import { Button } from "./button";
import WatchListButton from "./WatchListButton";
import { useRouter } from "next/navigation";
import { cn, getChangeColorClass } from "@/lib/utils";
import { useState } from "react";
import AlertModal from "./AlertModal";

export function WatchlistTable({ watchlist }: WatchlistTableProps) {
  const router = useRouter();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    company: string;
  } | null>(null);

  return (
    <>
      <Table className="scrollbar-hide-default watchlist-table">
        <TableHeader>
          <TableRow className="table-header-row">
            {WATCHLIST_TABLE_HEADER.map((label) => (
              <TableHead className="table-header" key={label}>
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist.map((item, index) => (
            <TableRow
              key={item.symbol + index}
              className="table-row"
              onClick={() =>
                router.push(`/stocks/${encodeURIComponent(item.symbol)}`)
              }
            >
              <TableCell className="pl-4 table-cell">{item.company}</TableCell>
              <TableCell className="table-cell">{item.symbol}</TableCell>
              <TableCell className="table-cell">
                {item.priceFormatted || "—"}
              </TableCell>
              <TableCell
                className={cn(
                  "table-cell",
                  getChangeColorClass(item.changePercent)
                )}
              >
                {item.changeFormatted || "—"}
              </TableCell>
              <TableCell className="table-cell">
                {item.marketCap || "—"}
              </TableCell>
              <TableCell className="table-cell">
                {item.peRatio || "—"}
              </TableCell>
              <TableCell>
                <Button
                  className="add-alert"
                  onClick={(e) => {
                    e.stopPropagation(); // Stop event from bubbling up to the row
                    setSelectedStock({
                      symbol: item.symbol,
                      company: item.company,
                    });
                    setAlertModalOpen(true);
                  }}
                >
                  Add Alert
                </Button>
              </TableCell>
              <TableCell>
                <div onClick={(e) => e.stopPropagation()}>
                  <WatchListButton
                    symbol={item.symbol}
                    company={item.company}
                    isInWatchlist={true}
                    showTrashIcon={true}
                    type="icon"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedStock && (
        <AlertModal
          open={alertModalOpen}
          setOpen={setAlertModalOpen}
          alertData={{
            symbol: selectedStock.symbol,
            company: selectedStock.company,
            alertName: "",
            alertType: "upper",
            threshold: "",
          }}
        />
      )}
    </>
  );
}
