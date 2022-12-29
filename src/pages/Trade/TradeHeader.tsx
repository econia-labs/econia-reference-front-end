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

export const TradeHeader: React.FC<{
  market: RegisteredMarket;
  setSelectedMarket: (market: RegisteredMarket) => void;
  markets: RegisteredMarket[];
}> = ({ market, setSelectedMarket, markets }) => {
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  const marketPrice = useMarketPrice(market);
  const takerEvents = useTakerEvents(market.marketId);
  const totalTrades = takerEvents.data?.length;

  if (
    baseCoinInfo.isLoading ||
    quoteCoinInfo.isLoading ||
    marketPrice.isLoading
  ) {
    // TODO: Better loading state
    return <DefaultWrapper>Loading...</DefaultWrapper>;
  } else if (baseCoinInfo.error || quoteCoinInfo.error || marketPrice.error) {
    // TODO: Better error states
    return <DefaultWrapper>Market price not found</DefaultWrapper>;
  } else if (!baseCoinInfo.data || !quoteCoinInfo.data) {
    return <DefaultWrapper>Coin info not found.</DefaultWrapper>;
  }

  let totalBaseVolume;
  let totalQuoteVolume;
  if (takerEvents.data) {
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
  }

  const priceChange =
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
      : null;

  // TODO: Header items shouldn't change widths after loading
  return (
    <DefaultWrapper
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
              {baseCoinInfo.data.symbol} / {quoteCoinInfo.data.symbol}
            </MarketNameWrapper>
            <MarketDropdown
              markets={markets}
              setSelectedMarket={setSelectedMarket}
              dropdownLabel="All markets ▼"
              allowMarketRegistration
            />
          </FlexRow>
        </MarketWrapper>
        <PriceWrapper>
          <Label>Price</Label>
          {marketPrice.data?.bestAskPrice?.toNumber()}{" "}
          {quoteCoinInfo.data.symbol}
        </PriceWrapper>
        <PriceChangeWrapper>
          <Label>Price Change</Label>
          <ColoredValue
            color={
              priceChange ? (priceChange.gte(0) ? "green" : "red") : undefined
            }
          >
            {priceChange ? (priceChange.gt(0) ? "+" : "") : null}
            {priceChange?.toNumber() ?? "-"} {quoteCoinInfo.data.symbol}
          </ColoredValue>
        </PriceChangeWrapper>
        <VolumeWrapper>
          <Label>Total Volume</Label>
          <span>
            {totalBaseVolume?.toNumber()} {baseCoinInfo.data.symbol} /{" "}
            {totalQuoteVolume?.toNumber()} {quoteCoinInfo.data.symbol}
          </span>
        </VolumeWrapper>
        <TradesWrapper>
          <Label>Total Trades</Label>
          <span>{totalTrades}</span>
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
