import React from "react";

import { css } from "@emotion/react";

import { TxLink } from "../../../components/TxLink";
import { BID } from "../../../constants";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { useTakerEvents } from "../../../hooks/useTakerEvents";
import { DefaultWrapper } from "../../../layout/DefaultWrapper";
import { toDecimalPrice, toDecimalSize } from "../../../utils/units";

export const TradesTable: React.FC<{ market: RegisteredMarket }> = ({
  market,
}) => {
  const takerEvents = useTakerEvents(market.marketId);
  const baseCoin = useCoinInfo(market.baseType);
  const quoteCoin = useCoinInfo(market.quoteType);

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
            <td>Version</td>
          </tr>
        </thead>
        <tbody>
          {takerEvents.data?.map(({ price, size, side, version }, i) => (
            <tr key={`${i}`}>
              <td
                css={(theme) => css`
                  text-align: left;
                  color: ${side === BID
                    ? theme.colors.green.primary
                    : theme.colors.red.primary};
                `}
              >
                {side === BID ? "BID" : "ASK"}
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
              <td>
                <TxLink
                  css={(theme) =>
                    css`
                      color: ${theme.colors.grey[600]};
                    `
                  }
                  txId={version}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DefaultWrapper>
  );
};
