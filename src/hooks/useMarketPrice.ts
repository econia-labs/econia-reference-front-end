import { useCallback } from "react";
import { useQuery } from "react-query";

import { BUY } from "../constants";
import { toDecimalPrice, toDecimalQuote, toDecimalSize } from "../utils/units";
import { useCoinInfo } from "./useCoinInfo";
import { useOrderBook } from "./useOrderBook";
import { RegisteredMarket } from "./useRegisteredMarkets";

export const useMarketPrice = (market: RegisteredMarket) => {
  const orderBook = useOrderBook(market.marketId);
  const baseCoin = useCoinInfo(market.baseType);
  const quoteCoin = useCoinInfo(market.quoteType);

  return useQuery({
    queryKey: ["useMarketPrice", market.marketId],
    queryFn: async () => {
      let bestAskPrice: number | undefined = undefined;
      for (const { price } of orderBook.data!.asks) {
        const priceNum = price.toJsNumber();
        if (bestAskPrice === undefined) {
          bestAskPrice = priceNum;
        } else if (priceNum < bestAskPrice) {
          bestAskPrice = priceNum;
        }
      }
      if (bestAskPrice) {
        bestAskPrice = toDecimalPrice({
          price: bestAskPrice,
          lotSize: market.lotSize,
          tickSize: market.tickSize,
          baseCoinDecimals: baseCoin.data!.decimals,
          quoteCoinDecimals: quoteCoin.data!.decimals,
        });
      }
      let bestBidPrice: number | undefined = undefined;
      for (const { price } of orderBook.data!.bids) {
        const priceNum = price.toJsNumber();
        if (bestBidPrice === undefined) {
          bestBidPrice = priceNum;
        } else if (priceNum > bestBidPrice) {
          bestBidPrice = priceNum;
        }
      }
      if (bestBidPrice) {
        bestAskPrice = toDecimalPrice({
          price: bestBidPrice,
          lotSize: market.lotSize,
          tickSize: market.tickSize,
          baseCoinDecimals: baseCoin.data!.decimals,
          quoteCoinDecimals: quoteCoin.data!.decimals,
        });
      }
      const maxBuyQuote =
        orderBook.data?.asks.reduce((acc, { size, price }) => {
          return acc + size.mul(price).toJsNumber();
        }, 0) ?? 0;
      const maxSellSize =
        orderBook.data?.bids.reduce(
          (acc, { size }) => acc + size.toJsNumber(),
          0,
        ) ?? 0;

      const getExecutionPrice = (
        size: number,
        direction: boolean,
      ): { sizeFillable: number; executionPrice: number } => {
        const orders =
          direction === BUY
            ? orderBook
                .data!.asks.slice()
                .sort((a, b) => a.price.sub(b.price).toJsNumber()) // asc
            : orderBook
                .data!.bids.slice()
                .sort((a, b) => b.price.sub(a.price).toJsNumber()); // desc
        let remainingSize = size;
        let totalPrice = 0;
        for (const { price, size: orderSize } of orders) {
          const orderSizeNum = orderSize.toJsNumber();
          if (remainingSize > orderSizeNum) {
            totalPrice += price.toJsNumber() * orderSizeNum;
            remainingSize -= orderSizeNum;
          } else {
            totalPrice += price.toJsNumber() * remainingSize;
            remainingSize = 0;
            break;
          }
        }
        return {
          sizeFillable: toDecimalSize({
            size: size - remainingSize,
            lotSize: market.lotSize,
            baseCoinDecimals: baseCoin.data!.decimals,
          }),
          executionPrice: toDecimalPrice({
            price: totalPrice / size,
            lotSize: market.lotSize,
            tickSize: market.tickSize,
            baseCoinDecimals: baseCoin.data!.decimals,
            quoteCoinDecimals: quoteCoin.data!.decimals,
          }),
        };
      };

      const getExecutionPriceQuote = (
        quote: number,
        direction: boolean,
      ): {
        quoteFillable: number;
        sizeFillable: number;
        executionPrice: number;
      } => {
        const orders =
          direction === BUY
            ? orderBook
                .data!.asks.slice()
                .sort((a, b) => a.price.sub(b.price).toJsNumber()) // asc
            : orderBook
                .data!.bids.slice()
                .sort((a, b) => b.price.sub(a.price).toJsNumber()); // desc
        let remainingQuote = quote;
        let totalSize = 0;
        for (const { price, size } of orders) {
          const quoteNum = size.mul(price).toJsNumber();
          if (remainingQuote >= quoteNum) {
            totalSize += size.toJsNumber();
            remainingQuote -= quoteNum;
          } else {
            // NOTE: Floor division used here to ensure integer size
            totalSize += Math.floor(remainingQuote / price.toJsNumber());
            remainingQuote = remainingQuote % price.toJsNumber();
            break;
          }
        }
        return {
          quoteFillable: toDecimalQuote({
            ticks: quote - remainingQuote,
            tickSize: market.tickSize,
            quoteCoinDecimals: quoteCoin.data!.decimals,
          }),
          sizeFillable: toDecimalSize({
            size: totalSize,
            lotSize: market.lotSize,
            baseCoinDecimals: baseCoin.data!.decimals,
          }),
          executionPrice: toDecimalPrice({
            price: (quote - remainingQuote) / totalSize,
            lotSize: market.lotSize,
            tickSize: market.tickSize,
            baseCoinDecimals: baseCoin.data!.decimals,
            quoteCoinDecimals: quoteCoin.data!.decimals,
          }),
        };
      };

      return {
        bestAskPrice,
        bestBidPrice,
        maxBuyQuote,
        maxSellSize,
        getExecutionPrice,
        getExecutionPriceQuote,
      };
    },
    enabled: !!orderBook.data && !!baseCoin.data && !!quoteCoin.data,
  });
};
