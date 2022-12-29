import BigNumber from "bignumber.js";

import React from "react";
import { Line } from "react-chartjs-2";

import { useTheme } from "@emotion/react";

import { ZERO_BIGNUMBER } from "../../../constants";
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
  const labels: number[] = [];
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

    // Append prices in ascending order to `labels`
    orderBook.data.bids
      .slice()
      .concat(orderBook.data.asks.slice())
      .sort((a, b) => a.price.toJsNumber() - b.price.toJsNumber())
      .forEach((o) => {
        labels.push(o.price.toJsNumber());
        bidData.push(undefined);
        askData.push(undefined);
      });

    const bidPriceToSize = new Map<number, number>();
    const askPriceToSize = new Map<number, number>();
    for (const { price, size } of orderBook.data.bids) {
      const priceKey = price.toJsNumber();
      if (!bidPriceToSize.has(priceKey)) {
        bidPriceToSize.set(priceKey, 0);
      }
      bidPriceToSize.set(
        priceKey,
        bidPriceToSize.get(priceKey)! + size.toJsNumber(),
      );
    }
    for (const { price, size } of orderBook.data.asks) {
      const priceKey = price.toJsNumber();
      if (!askPriceToSize.has(priceKey)) {
        askPriceToSize.set(priceKey, 0);
      }
      askPriceToSize.set(
        priceKey,
        askPriceToSize.get(priceKey)! + size.toJsNumber(),
      );
    }

    let askAcc = ZERO_BIGNUMBER;
    for (let i = 0; i < labels.length; i++) {
      const price = labels[i];
      if (askPriceToSize.has(price))
        askAcc = askAcc.plus(askPriceToSize.get(price)!);
      if (askAcc.gt(0))
        askData[i] = toDecimalSize({
          size: askAcc,
          lotSize: market.lotSize,
          baseCoinDecimals: baseCoinInfo.decimals,
        }).toNumber();
    }

    // We go in reverse order to get the accumulated bid size
    let bidAcc = ZERO_BIGNUMBER;
    for (let i = labels.length - 1; i >= 0; i--) {
      const price = labels[i];
      if (bidPriceToSize.has(price))
        bidAcc = bidAcc.plus(bidPriceToSize.get(price)!);
      if (bidAcc.gt(0))
        bidData[i] = toDecimalSize({
          size: bidAcc,
          lotSize: market.lotSize,
          baseCoinDecimals: baseCoinInfo.decimals,
        }).toNumber();
    }

    labels.forEach((price, i) => {
      labels[i] = toDecimalPrice({
        price: new BigNumber(price),
        lotSize: market.lotSize,
        tickSize: market.tickSize,
        baseCoinDecimals: baseCoinInfo.decimals,
        quoteCoinDecimals: quoteCoinInfo.decimals,
      }).toNumber();
    });
  }

  return (
    <Line
      options={{
        responsive: true,
        interaction: {
          intersect: false,
        },
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
