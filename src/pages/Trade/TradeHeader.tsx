import BigNumber from "bignumber.js";

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Label } from "../../components/Label";
import { Loading } from "../../components/Loading";
import { MarketDropdown } from "../../components/MarketDropdown";
import { ZERO_BIGNUMBER } from "../../constants";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useMarketPrice } from "../../hooks/useMarketPrice";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { useTakerEvents } from "../../hooks/useTakerEvents";
import {
  toDecimalPrice,
  toDecimalQuote,
  toDecimalSize,
} from "../../utils/units";

// Notes:
// TradeHeaderView has no logic, it is only display and knows how to handle undefined values
// TradeHeaderInner has logic for fetching via hooks and ultimately renders TradeHeaderView
// TradeHeader is a wrapper that handles the case where market is undefined
// TODO: Can probably use this kind of pattern less if the hooks can take in undefined values

export const TradeHeader: React.FC<{
  className?: string;
  market?: RegisteredMarket;
  setSelectedMarket: (market: RegisteredMarket) => void;
  markets?: RegisteredMarket[];
}> = ({ className, market, setSelectedMarket, markets }) => {
  if (market === undefined || markets === undefined)
    return (
      <TradeHeaderView
        className={className}
        setSelectedMarket={setSelectedMarket}
      />
    );
  return (
    <TradeHeaderInner
      className={className}
      market={market}
      setSelectedMarket={setSelectedMarket}
      markets={markets}
    />
  );
};

const TradeHeaderInner: React.FC<{
  className?: string;
  market: RegisteredMarket;
  setSelectedMarket: (market: RegisteredMarket) => void;
  markets: RegisteredMarket[];
}> = ({ className, market, setSelectedMarket, markets }) => {
  const baseCoinInfo = useCoinInfo(market?.baseType);
  const quoteCoinInfo = useCoinInfo(market?.quoteType);
  const marketPrice = useMarketPrice(market);
  const takerEvents = useTakerEvents(market.marketId);

  const price =
    marketPrice.data === null ? null : marketPrice.data?.bestAskPrice;
  const totalTrades = takerEvents.data?.length;

  let totalBaseVolume;
  let totalQuoteVolume;
  let priceChange;
  if (baseCoinInfo.data && quoteCoinInfo.data && takerEvents.data) {
    if (takerEvents.data) {
      if (takerEvents.data.length > 0) {
        for (const takerEvent of takerEvents.data) {
          if (!totalBaseVolume) totalBaseVolume = ZERO_BIGNUMBER;
          if (!totalQuoteVolume) totalQuoteVolume = ZERO_BIGNUMBER;
          totalBaseVolume = totalBaseVolume.plus(takerEvent.size);
          totalQuoteVolume = totalQuoteVolume.plus(
            takerEvent.size.multipliedBy(takerEvent.price),
          );
        }
        if (totalBaseVolume) {
          totalBaseVolume = toDecimalSize({
            size: totalBaseVolume,
            lotSize: market.lotSize,
            baseCoinDecimals: baseCoinInfo.data.decimals,
          });
        }
        if (totalQuoteVolume) {
          totalQuoteVolume = toDecimalQuote({
            ticks: totalQuoteVolume,
            tickSize: market.tickSize,
            quoteCoinDecimals: quoteCoinInfo.data.decimals,
          });
        }
      } else {
        // We only set these to zero if there are no taker events to ensure we
        // show the loading state
        totalQuoteVolume = ZERO_BIGNUMBER;
        totalBaseVolume = ZERO_BIGNUMBER;
      }

      if (takerEvents.data.length > 1) {
        priceChange = toDecimalPrice({
          price: takerEvents.data[takerEvents.data.length - 1].price.minus(
            takerEvents.data[takerEvents.data.length - 2]?.price ??
              ZERO_BIGNUMBER,
          ),
          lotSize: market.lotSize,
          tickSize: market.tickSize,
          baseCoinDecimals: baseCoinInfo.data.decimals,
          quoteCoinDecimals: quoteCoinInfo.data.decimals,
        });
      } else {
        priceChange = null;
      }
    }
  }

  return (
    <TradeHeaderView
      className={className}
      baseSymbol={baseCoinInfo.data?.symbol}
      quoteSymbol={quoteCoinInfo.data?.symbol}
      markets={markets}
      price={price}
      priceChange={priceChange}
      totalBaseVolume={totalBaseVolume}
      totalQuoteVolume={totalQuoteVolume}
      totalTrades={totalTrades}
      setSelectedMarket={setSelectedMarket}
    />
  );
};

const TradeHeaderView: React.FC<{
  className?: string;
  baseSymbol?: string;
  quoteSymbol?: string;
  markets?: RegisteredMarket[];
  price?: BigNumber | null;
  priceChange?: BigNumber | null;
  totalBaseVolume?: BigNumber;
  totalQuoteVolume?: BigNumber;
  totalTrades?: number;
  setSelectedMarket: (market: RegisteredMarket) => void;
}> = ({
  className,
  baseSymbol,
  quoteSymbol,
  markets,
  price,
  priceChange,
  totalBaseVolume,
  totalQuoteVolume,
  totalTrades,
  setSelectedMarket,
}) => {
  return (
    <FlexRow
      className={className}
      css={css`
        display: flex;
        flex-wrap: wrap;
      `}
    >
      <MarketWrapper>
        <FlexRow
          css={css`
            justify-content: space-between;
            align-items: center;
            width: 100%;
          `}
        >
          <MarketNameWrapper>
            <Label>Market</Label>
            {baseSymbol && quoteSymbol ? (
              `${baseSymbol} / ${quoteSymbol}`
            ) : (
              <Loading />
            )}
          </MarketNameWrapper>
          {markets ? (
            <MarketDropdown
              markets={markets}
              setSelectedMarket={setSelectedMarket}
              dropdownLabel="All markets ▼"
              allowMarketRegistration
            />
          ) : (
            <div />
          )}
        </FlexRow>
      </MarketWrapper>
      <PriceWrapper>
        <Label>Price</Label>
        <div
          css={css`
            width: 120px;
          `}
        >
          {price === null ? (
            "--"
          ) : price === undefined ? (
            <Loading />
          ) : (
            `${price.toPrecision(4)} ${quoteSymbol}`
          )}
        </div>
      </PriceWrapper>
      <PriceChangeWrapper>
        <Label>Price Change</Label>
        <div
          css={css`
            width: 120px;
          `}
        >
          {priceChange === null ? (
            "--"
          ) : priceChange === undefined ? (
            <Loading />
          ) : (
            <ColoredValue color={priceChange.gte(0) ? "green" : "red"}>
              {priceChange.gt(0) ? "+" : ""}
              {priceChange.toPrecision(4) ?? "-"} {quoteSymbol}
            </ColoredValue>
          )}
        </div>
      </PriceChangeWrapper>
      <VolumeWrapper>
        <Label>Total Volume</Label>
        <div
          css={css`
            // May not work if the volume is too large or too small
            width: 280px;
          `}
        >
          {
            <FlexRow
              css={css`
                gap: 4px;
              `}
            >
              <span>
                {totalBaseVolume ? (
                  `${totalBaseVolume.toPrecision(4)} ${baseSymbol}`
                ) : (
                  <Loading />
                )}
              </span>
              <span>/</span>
              <span>
                {totalQuoteVolume ? (
                  `${totalQuoteVolume.toPrecision(4)} ${quoteSymbol}`
                ) : (
                  <Loading />
                )}
              </span>
            </FlexRow>
          }
        </div>
      </VolumeWrapper>
      <TradesWrapper>
        <Label>Total Trades</Label>
        <div
          css={css`
            width: 92px;
          `}
        >
          {totalTrades !== undefined ? <span>{totalTrades}</span> : <Loading />}
        </div>
      </TradesWrapper>
    </FlexRow>
  );
};

const HeaderItemWrapper = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.grey[600]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[600]};
  padding: 8px 32px;
`;

const MarketWrapper = styled(HeaderItemWrapper)`
  flex-grow: 1;
  display: flex;
  border-right: 1px solid ${({ theme }) => theme.colors.grey[600]};
`;

const MarketNameWrapper = styled(FlexCol)`
  margin-left: 0px;
  border-right: none;
  border-bottom: none;
`;

const PriceWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.grey[600]};
`;

const PriceChangeWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.grey[600]};
`;

const VolumeWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.grey[600]};
`;

const TradesWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
`;

const ColoredValue = styled.span<{ color?: "green" | "red" }>`
  color: ${({ color, theme }) =>
    color
      ? color === "green"
        ? theme.colors.green.primary
        : "#F86C6B"
      : theme.colors.grey[600]};
`;
