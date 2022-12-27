import { parseTypeTagOrThrow } from "@manahippo/move-to-ts";

import React, { useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { DropdownMenu } from "../../components/DropdownMenu";
import { FlexRow } from "../../components/FlexRow";
import { Label } from "../../components/Label";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useMarketPrice } from "../../hooks/useMarketPrice";
import { useOnClickawayRef } from "../../hooks/useOnClickawayRef";
import { useRegisterMarket } from "../../hooks/useRegisterMarket";
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
  const [showMarketMenu, setShowMarketMenu] = useState(false);
  const marketMenuClickawayRef = useOnClickawayRef(() =>
    setShowMarketMenu(false),
  );
  const registerMarket = useRegisterMarket();
  const marketPrice = useMarketPrice(market);
  const takerEvents = useTakerEvents(market.marketId);
  const totalTrades = takerEvents.data?.length;
  console.log(takerEvents.data);

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
      if (!totalBaseVolume) totalBaseVolume = 0;
      if (!totalQuoteVolume) totalQuoteVolume = 0;
      totalBaseVolume += takerEvent.size;
      totalQuoteVolume += takerEvent.size * takerEvent.price;
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
          price:
            takerEvents.data[takerEvents.data.length - 1].price -
              takerEvents.data[takerEvents.data.length - 2]?.price ?? 0,
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
          {/* <img
              css={css`
                margin-right: 8px;
                width: 32px;
                height: 32px;
              `}
              src={marketCoin.logo_url}
            /> */}
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
            <div ref={marketMenuClickawayRef}>
              <MarketSelector
                onClick={() => setShowMarketMenu(!showMarketMenu)}
              >
                All markets ▼
              </MarketSelector>
              <DropdownMenu
                css={css`
                  margin-top: 4px;
                `}
                show={showMarketMenu}
              >
                {markets.map((market, i) => (
                  <MarketMenuItem
                    onClick={() => {
                      setSelectedMarket(market);
                      setShowMarketMenu(false);
                    }}
                    key={i}
                  >
                    {market.baseType.name}-{market.quoteType.name}
                  </MarketMenuItem>
                ))}
                <MarketMenuItem
                  onClick={async () => {
                    const baseCoin = prompt("Enter base coin address");
                    const quoteCoin = prompt("Enter quote coin address");
                    if (baseCoin === null) {
                      alert("Base coin address is required");
                      return;
                    } else if (quoteCoin === null) {
                      alert("Quote coin address is required");
                      return;
                    }
                    await registerMarket(
                      parseTypeTagOrThrow(baseCoin),
                      parseTypeTagOrThrow(quoteCoin),
                    ).catch((e) =>
                      console.error("Error registering market", e),
                    );
                    setShowMarketMenu(false);
                  }}
                >
                  New market
                </MarketMenuItem>
              </DropdownMenu>
            </div>
          </FlexRow>
        </MarketWrapper>
        <PriceWrapper>
          <Label>Price</Label>
          {marketPrice.data?.bestAskPrice?.toFixed(2)}{" "}
          {quoteCoinInfo.data.symbol}
        </PriceWrapper>
        <PriceChangeWrapper>
          <Label>Price Change</Label>
          <ColoredValue
            color={
              priceChange ? (priceChange >= 0 ? "green" : "red") : undefined
            }
          >
            {priceChange ?? "-"} {quoteCoinInfo.data.symbol}
          </ColoredValue>
        </PriceChangeWrapper>
        <VolumeWrapper>
          <Label>Total Volume</Label>
          <span>
            {totalBaseVolume?.toFixed(2)} {baseCoinInfo.data.symbol} /{" "}
            {totalQuoteVolume?.toFixed(2)} {quoteCoinInfo.data.symbol}
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
  padding: 0 16px;
`;

const MarketWrapper = styled(HeaderItemWrapper)`
  flex-grow: 1;
  display: flex;
`;

const MarketSelector = styled.span`
  color: ${({ theme }) => theme.colors.grey[600]};
  padding: 4px 8px;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.colors.grey[700]};
  }
`;

const MarketMenuItem = styled.div`
  background-color: ${({ theme }) => theme.colors.grey[800]};
  padding: 8px;
`;

const MarketNameWrapper = styled(HeaderItemWrapper)`
  display: flex;
  flex-direction: column;
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
