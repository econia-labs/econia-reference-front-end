import BigNumber from "bignumber.js";

import { useCallback } from "react";
import { useQuery } from "react-query";

import { BUY, ZERO_BIGNUMBER } from "../constants";
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
      let bestAskPrice: BigNumber | undefined = undefined;
      for (const { price } of orderBook.data!.asks) {
        const priceBn = new BigNumber(price.toJsNumber());
        if (bestAskPrice === undefined) {
          bestAskPrice = priceBn;
        } else if (priceBn.lt(bestAskPrice)) {
          bestAskPrice = priceBn;
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
      let bestBidPrice: BigNumber | undefined = undefined;
      for (const { price } of orderBook.data!.bids) {
        const priceBn = new BigNumber(price.toJsNumber());
        if (bestBidPrice === undefined) {
          bestBidPrice = priceBn;
        } else if (priceBn.gt(bestBidPrice)) {
          bestBidPrice = priceBn;
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
          return acc.plus(size.mul(price).toJsNumber());
        }, ZERO_BIGNUMBER) ?? ZERO_BIGNUMBER;
      const maxSellSize =
        orderBook.data?.bids.reduce(
          (acc, { size }) => acc.plus(size.toJsNumber()),
          ZERO_BIGNUMBER,
        ) ?? ZERO_BIGNUMBER;

      const getExecutionPrice = (
        size: BigNumber,
        direction: boolean,
      ): { sizeFillable: BigNumber; executionPrice: BigNumber } => {
        const orders =
          direction === BUY
            ? orderBook
                .data!.asks.slice()
                .sort((a, b) => a.price.sub(b.price).toJsNumber()) // asc
            : orderBook
                .data!.bids.slice()
                .sort((a, b) => b.price.sub(a.price).toJsNumber()); // desc
        let remainingSize = size;
        let totalPrice = ZERO_BIGNUMBER;
        for (const { price, size: orderSize } of orders) {
          const orderSizeNum = orderSize.toJsNumber();
          if (remainingSize.gt(orderSizeNum)) {
            totalPrice = totalPrice.plus(price.toJsNumber() * orderSizeNum);
            remainingSize = remainingSize.minus(orderSizeNum);
          } else {
            totalPrice = totalPrice.plus(
              remainingSize.multipliedBy(price.toJsNumber()),
            );
            remainingSize = ZERO_BIGNUMBER;
            break;
          }
        }
        return {
          sizeFillable: toDecimalSize({
            size: size.minus(remainingSize),
            lotSize: market.lotSize,
            baseCoinDecimals: baseCoin.data!.decimals,
          }),
          executionPrice: toDecimalPrice({
            price: totalPrice.div(size),
            lotSize: market.lotSize,
            tickSize: market.tickSize,
            baseCoinDecimals: baseCoin.data!.decimals,
            quoteCoinDecimals: quoteCoin.data!.decimals,
          }),
        };
      };

      const getExecutionPriceQuote = (
        quote: BigNumber,
        direction: boolean,
      ): {
        quoteFillable: BigNumber;
        sizeFillable: BigNumber;
        executionPrice: BigNumber;
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
        let totalSize = ZERO_BIGNUMBER;
        for (const { price, size } of orders) {
          const quoteBn = new BigNumber(size.mul(price).toJsNumber());
          if (remainingQuote.gte(quoteBn)) {
            totalSize = totalSize.plus(size.toJsNumber());
            remainingQuote = remainingQuote.minus(quoteBn);
          } else {
            // NOTE: Floor division used here to ensure integer size
            totalSize = totalSize.plus(
              remainingQuote.div(price.toJsNumber()).toFixed(0),
            );
            remainingQuote = remainingQuote.mod(price.toJsNumber());
            break;
          }
        }
        return {
          quoteFillable: toDecimalQuote({
            ticks: quote.minus(remainingQuote),
            tickSize: market.tickSize,
            quoteCoinDecimals: quoteCoin.data!.decimals,
          }),
          sizeFillable: toDecimalSize({
            size: totalSize,
            lotSize: market.lotSize,
            baseCoinDecimals: baseCoin.data!.decimals,
          }),
          executionPrice: toDecimalPrice({
            price: quote.minus(remainingQuote).div(totalSize),
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
