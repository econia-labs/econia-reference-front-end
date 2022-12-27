import React from "react";

import { css } from "@emotion/react";

import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { useOrderBook } from "../../../hooks/useOrderBook";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { DefaultWrapper } from "../../../layout/DefaultWrapper";
import { toDecimalPrice, toDecimalSize } from "../../../utils/units";

export const BookTable: React.FC<{ market: RegisteredMarket }> = ({
  market,
}) => {
  const orderBook = useOrderBook(market.marketId);
  const baseCoin = useCoinInfo(market.baseType);
  const quoteCoin = useCoinInfo(market.quoteType);
  const bidsByPrice = new Map<number, number>();
  const asksByPrice = new Map<number, number>();
  for (const order of orderBook.data?.bids ?? []) {
    const price = order.price.toJsNumber();
    if (!bidsByPrice.has(price)) bidsByPrice.set(price, 0);
    bidsByPrice.set(price, bidsByPrice.get(price)! + order.size.toJsNumber());
  }
  for (const order of orderBook.data?.asks ?? []) {
    const price = order.price.toJsNumber();
    if (!asksByPrice.has(price)) asksByPrice.set(price, 0);
    asksByPrice.set(price, asksByPrice.get(price)! + order.size.toJsNumber());
  }

  if (baseCoin.isLoading || quoteCoin.isLoading)
    return <DefaultWrapper>Loading...</DefaultWrapper>;
  else if (!baseCoin.data || !quoteCoin.data) {
    return <DefaultWrapper>No data for coins</DefaultWrapper>;
  }
  return (
    <DefaultWrapper>
      <table
        css={css`
          width: 100%;
          text-align: right;
        `}
      >
        <thead>
          <tr>
            <td
              css={css`
                text-align: left;
              `}
            >
              Side
            </td>
            <td>Size</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          {Array.from(asksByPrice.entries())
            .sort(([priceA], [priceB]) => priceA - priceB)
            .map(([price, size], i) => (
              <tr key={`ASK-${i}`}>
                <td
                  css={(theme) => css`
                    text-align: left;
                    color: ${theme.colors.red.primary};
                  `}
                >
                  ASK
                </td>
                <td>
                  {toDecimalSize({
                    size,
                    lotSize: market.lotSize,
                    baseCoinDecimals: baseCoin.data.decimals,
                  }).toFixed(3)}
                </td>
                <td>
                  {toDecimalPrice({
                    price,
                    lotSize: market.lotSize,
                    tickSize: market.tickSize,
                    baseCoinDecimals: baseCoin.data.decimals,
                    quoteCoinDecimals: quoteCoin.data.decimals,
                  }).toFixed(2)}
                </td>
              </tr>
            ))}
          <tr>
            <td
              css={css`
                text-align: left;
              `}
            >
              --
            </td>
            <td>--</td>
            <td>--</td>
          </tr>
          {Array.from(bidsByPrice.entries())
            .sort(([priceA], [priceB]) => priceA - priceB)
            .map(([price, size], i) => (
              <tr key={`BID-${i}`}>
                <td
                  css={(theme) => css`
                    text-align: left;
                    color: ${theme.colors.green.primary};
                  `}
                >
                  BID
                </td>
                <td>
                  {toDecimalSize({
                    size,
                    lotSize: market.lotSize,
                    baseCoinDecimals: baseCoin.data.decimals,
                  }).toFixed(3)}
                </td>
                <td>
                  {toDecimalPrice({
                    price,
                    lotSize: market.lotSize,
                    tickSize: market.tickSize,
                    baseCoinDecimals: baseCoin.data.decimals,
                    quoteCoinDecimals: quoteCoin.data.decimals,
                  }).toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </DefaultWrapper>
  );
};
