import React from "react";
import { Line } from "react-chartjs-2";

import { useTheme } from "@emotion/react";

import { CoinInfo } from "../../../hooks/useCoinInfo";
import { useOrderBook } from "../../../hooks/useOrderBook";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { toDecimalPrice, toDecimalSize } from "../../../utils/units";

export const DepthChart: React.FC<{
  market: RegisteredMarket;
  baseCoinInfo: CoinInfo;
  quoteCoinInfo: CoinInfo;
}> = ({ market, baseCoinInfo, quoteCoinInfo }) => {
  const theme = useTheme();
  const orderBook = useOrderBook(market.marketId);
  const labels = [];
  const bidData: (number | undefined)[] = [];
  const askData: (number | undefined)[] = [];
  if (orderBook.data) {
    // Get min and max price to set a range
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    for (const order of orderBook.data.bids.concat(orderBook.data.asks)) {
      if (order.price.toJsNumber() < minPrice) {
        minPrice = order.price.toJsNumber();
      }
      if (order.price.toJsNumber() > maxPrice) {
        maxPrice = order.price.toJsNumber();
      }
    }
    const start = minPrice - 1;
    const end = maxPrice + 1;
    for (let price = start; price <= end; price += 1) {
      labels.push(
        toDecimalPrice({
          price,
          lotSize: market.lotSize,
          tickSize: market.tickSize,
          baseCoinDecimals: baseCoinInfo.decimals,
          quoteCoinDecimals: quoteCoinInfo.decimals,
        }).toFixed(2),
      );
      bidData.push(undefined);
      askData.push(undefined);
    }
    for (const { price, size } of orderBook.data.bids) {
      const idx = price.toJsNumber() - start;
      bidData[idx] =
        (bidData[idx] ?? 0) +
        toDecimalSize({
          size: size.toJsNumber(),
          lotSize: market.lotSize,
          baseCoinDecimals: baseCoinInfo.decimals,
        });
    }
    for (const { price, size } of orderBook.data.asks) {
      const idx = price.toJsNumber() - start;
      askData[idx] =
        (askData[idx] ?? 0) +
        toDecimalSize({
          size: size.toJsNumber(),
          lotSize: market.lotSize,
          baseCoinDecimals: baseCoinInfo.decimals,
        });
    }
    let seenFirstBid = false;
    for (let i = bidData.length - 2; i >= 0; i--) {
      // Move down until bidData[i + 1] is not undefined
      if (bidData[i + 1] === undefined) continue;
      if (!seenFirstBid) {
        bidData[i + 2] = 0;
        seenFirstBid = true;
      }
      bidData[i] = (bidData[i] ?? 0) + bidData[i + 1]!;
    }
    let seenFirstAsk = false;
    for (let i = 1; i < askData.length; i++) {
      // Move up until askData[i - 1] is not undefined
      if (askData[i - 1] === undefined) continue;
      if (!seenFirstAsk) {
        askData[i - 2] = 0;
        seenFirstAsk = true;
      }
      askData[i] = (askData[i] ?? 0) + askData[i - 1]!;
    }
  }

  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }}
      data={{
        labels,
        datasets: [
          {
            fill: true,
            label: "Size",
            data: bidData,
            borderColor: theme.colors.green.primary,
            backgroundColor: theme.colors.green.primary + "44",
            stepped: true,
          },
          {
            fill: true,
            label: "Size",
            data: askData,
            borderColor: theme.colors.red.primary,
            backgroundColor: theme.colors.red.primary + "44",
            stepped: true,
          },
        ],
      }}
    />
  );
};
