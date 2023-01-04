import BigNumber from "bignumber.js";

import React from "react";

import { css } from "@emotion/react";

import { Loading } from "../../../components/Loading";
import { ZERO_BIGNUMBER } from "../../../constants";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { useOrderBook } from "../../../hooks/useOrderBook";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { DefaultWrapper } from "../../../layout/DefaultWrapper";
import { toDecimalPrice, toDecimalSize } from "../../../utils/units";

export const BookTable: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ className, market }) => {
  const orderBook = useOrderBook(market.marketId);
  const baseCoin = useCoinInfo(market.baseType);
  const quoteCoin = useCoinInfo(market.quoteType);
  const bidsByPrice = new Map<number, BigNumber>();
  const asksByPrice = new Map<number, BigNumber>();
  for (const order of orderBook.data?.bids ?? []) {
    const price = order.price.toJsNumber();
    if (!bidsByPrice.has(price)) bidsByPrice.set(price, ZERO_BIGNUMBER);
    bidsByPrice.set(
      price,
      bidsByPrice.get(price)!.plus(order.size.toJsNumber()),
    );
  }
  for (const order of orderBook.data?.asks ?? []) {
    const price = order.price.toJsNumber();
    if (!asksByPrice.has(price)) asksByPrice.set(price, ZERO_BIGNUMBER);
    asksByPrice.set(
      price,
      asksByPrice.get(price)!.plus(order.size.toJsNumber()),
    );
  }

  if (baseCoin.isLoading || quoteCoin.isLoading) return <Loading />;
  else if (!baseCoin.data || !quoteCoin.data) {
    return <DefaultWrapper>No data for coins</DefaultWrapper>;
  }
  return (
    <DefaultWrapper className={className}>
      <table
        css={(theme) => css`
          width: 100%;
          text-align: right;
          thead {
            position: sticky;
            top: 0px;
            z-index: 1;
            background: ${theme.colors.grey[800]};
          }
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
            .sort(([priceA], [priceB]) => priceB - priceA)
            .map(([price, size], i) => {
              if (!baseCoin.data || !quoteCoin.data) return null;
              return (
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
                    }).toNumber()}
                  </td>
                  <td>
                    {toDecimalPrice({
                      price: new BigNumber(price),
                      lotSize: market.lotSize,
                      tickSize: market.tickSize,
                      baseCoinDecimals: baseCoin.data.decimals,
                      quoteCoinDecimals: quoteCoin.data.decimals,
                    }).toNumber()}
                  </td>
                </tr>
              );
            })}
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
            .sort(([priceA], [priceB]) => priceB - priceA)
            .map(([price, size], i) => {
              if (!baseCoin.data || !quoteCoin.data) return null;
              return (
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
                    }).toNumber()}
                  </td>
                  <td>
                    {toDecimalPrice({
                      price: new BigNumber(price),
                      lotSize: market.lotSize,
                      tickSize: market.tickSize,
                      baseCoinDecimals: baseCoin.data.decimals,
                      quoteCoinDecimals: quoteCoin.data.decimals,
                    }).toNumber()}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </DefaultWrapper>
  );
};
