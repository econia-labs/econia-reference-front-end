import React from "react";

import { css } from "@emotion/react";

import { Loading } from "../../../components/Loading";
import { TxLink } from "../../../components/TxLink";
import { BID } from "../../../constants";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { useTakerEvents } from "../../../hooks/useTakerEvents";
import { DefaultWrapper } from "../../../layout/DefaultWrapper";
import { toDecimalPrice, toDecimalSize } from "../../../utils/units";

export const TradesTable: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ className, market }) => {
  const takerEvents = useTakerEvents(market.marketId);
  const baseCoin = useCoinInfo(market.baseType);
  const quoteCoin = useCoinInfo(market.quoteType);

  if (takerEvents.isLoading || baseCoin.isLoading || quoteCoin.isLoading)
    // TODO: Better loading state
    return <Loading />;
  else if (!takerEvents.data || !baseCoin.data || !quoteCoin.data) {
    // TODO: Better error state
    return <DefaultWrapper>Error getting data</DefaultWrapper>;
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
            <td>Version</td>
          </tr>
        </thead>
        <tbody>
          {takerEvents.data
            .sort(({ version: vA }, { version: vB }) => vB - vA)
            .map(({ price, size, side, version }, i) => {
              if (!baseCoin.data || !quoteCoin.data) return null;
              return (
                <tr key={i}>
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
                    }).toNumber()}
                  </td>
                  <td>
                    {toDecimalPrice({
                      price,
                      lotSize: market.lotSize,
                      tickSize: market.tickSize,
                      baseCoinDecimals: baseCoin.data.decimals,
                      quoteCoinDecimals: quoteCoin.data.decimals,
                    }).toNumber()}
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
              );
            })}
        </tbody>
      </table>
    </DefaultWrapper>
  );
};
