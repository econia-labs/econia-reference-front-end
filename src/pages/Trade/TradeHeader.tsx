import BigNumber from "bignumber.js";

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FlexRow } from "../../components/FlexRow";
import { Label } from "../../components/Label";
import { MarketDropdown } from "../../components/MarketDropdown";
import { ZERO_BIGNUMBER } from "../../constants";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useMarketPrice } from "../../hooks/useMarketPrice";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { useTakerEvents } from "../../hooks/useTakerEvents";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { DefaultWrapper } from "../../layout/DefaultWrapper";
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
        baseSymbol={undefined}
        quoteSymbol={undefined}
        markets={markets}
        price={undefined}
        priceChange={undefined}
        totalBaseVolume={undefined}
        totalQuoteVolume={undefined}
        totalTrades={undefined}
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
  const totalTrades = takerEvents.data?.length;

  let totalBaseVolume;
  let totalQuoteVolume;
  let priceChange;
  if (baseCoinInfo.data && quoteCoinInfo.data && takerEvents.data) {
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
    priceChange =
      takerEvents.data && takerEvents.data.length > 1
        ? toDecimalPrice({
            price: takerEvents.data[takerEvents.data.length - 1].price.minus(
              takerEvents.data[takerEvents.data.length - 2]?.price ??
                ZERO_BIGNUMBER,
            ),
            lotSize: market.lotSize,
            tickSize: market.tickSize,
            baseCoinDecimals: baseCoinInfo.data.decimals,
            quoteCoinDecimals: quoteCoinInfo.data.decimals,
          })
        : undefined;
  }

  return (
    <TradeHeaderView
      className={className}
      baseSymbol={baseCoinInfo.data?.symbol}
      quoteSymbol={quoteCoinInfo.data?.symbol}
      markets={markets}
      price={marketPrice.data?.bestAskPrice}
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
  price?: BigNumber;
  priceChange?: BigNumber;
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
    <DefaultWrapper
      className={className}
      css={(theme) => css`
        border-bottom: 1px solid ${theme.colors.grey[700]};
        border-left: 1px solid ${theme.colors.grey[700]};
        border-right: 1px solid ${theme.colors.grey[700]};
        padding: 8px 36px;
      `}
    >
      <DefaultContainer
        css={css`
          display: flex;
          justify-content: space-between;
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
              {baseSymbol && quoteSymbol
                ? `${baseSymbol} / ${quoteSymbol}`
                : "Loading..."}
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
            {price ? `${price.toPrecision(4)} ${quoteSymbol}` : "Loading..."}
          </div>
        </PriceWrapper>
        <PriceChangeWrapper>
          <Label>Price Change</Label>
          <div
            css={css`
              width: 120px;
            `}
          >
            {priceChange ? (
              <ColoredValue color={priceChange.gte(0) ? "green" : "red"}>
                {priceChange.gt(0) ? "+" : ""}
                {priceChange.toPrecision(4) ?? "-"} {quoteSymbol}
              </ColoredValue>
            ) : (
              "Loading..."
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
            {totalBaseVolume && totalQuoteVolume ? (
              <FlexRow
                css={css`
                  gap: 4px;
                `}
              >
                <span>
                  {totalBaseVolume.toPrecision(4)} {baseSymbol}
                </span>
                <span>/</span>
                <span>
                  {totalQuoteVolume.toPrecision(4)} {quoteSymbol}
                </span>
              </FlexRow>
            ) : (
              "Loading..."
            )}
          </div>
        </VolumeWrapper>
        <TradesWrapper>
          <Label>Total Trades</Label>
          <div
            css={css`
              width: 92px;
            `}
          >
            {totalTrades !== undefined ? (
              <span>{totalTrades}</span>
            ) : (
              "Loading..."
            )}
          </div>
        </TradesWrapper>
      </DefaultContainer>
    </DefaultWrapper>
  );
};

const HeaderItemWrapper = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.grey[700]};
  margin: 0 16px;
`;

const MarketWrapper = styled(HeaderItemWrapper)`
  flex-grow: 1;
  display: flex;
  margin-left: 0px;
`;

const MarketNameWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
  margin-left: 0px;
`;

const PriceWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
`;

const PriceChangeWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
`;

const VolumeWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
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
