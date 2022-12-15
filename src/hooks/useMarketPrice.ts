import { useQuery } from "react-query";

import { toDecimalPrice } from "../utils/price";
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

      return { bestAskPrice, bestBidPrice };
    },
    enabled: !!orderBook.data && !!baseCoin.data && !!quoteCoin.data,
  });
};
