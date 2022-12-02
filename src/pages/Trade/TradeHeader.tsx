import { RawCoinInfo } from "@manahippo/coin-list";
import { DefaultContainer } from "layout/DefaultContainer";
import { DefaultWrapper } from "layout/DefaultWrapper";

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const TradeHeader: React.FC<{
  marketCoin: RawCoinInfo;
  quoteCoin: RawCoinInfo;
}> = ({ marketCoin, quoteCoin }) => {
  return (
    <DefaultWrapper
      css={css`
        border-bottom: 1px solid #565656;
      `}
    >
      <DefaultContainer
        css={css`
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
        `}
      >
        <MarketWrapper>
          <img
            css={css`
              margin-right: 8px;
              width: 32px;
              height: 32px;
            `}
            src={marketCoin.logo_url}
          />
          <span>
            {marketCoin.symbol}-{quoteCoin.symbol}
          </span>
        </MarketWrapper>
        <PriceWrapper>$16,257</PriceWrapper>
        <PriceChangeWrapper>
          <Label>24h Change</Label>
          <ColoredValue color={"red"}>-$18.1</ColoredValue>
        </PriceChangeWrapper>
        <VolumeWrapper>
          <Label>24h Volume</Label>
          <span>$408,639,821</span>
        </VolumeWrapper>
        <TradesWrapper>
          <Label>24h Trades</Label>
          <span>69,855</span>
        </TradesWrapper>
      </DefaultContainer>
    </DefaultWrapper>
  );
};

const HeaderItemWrapper = styled.div`
  border-right: 1px solid #565656;
  padding: 0 16px;
`;

const MarketWrapper = styled(HeaderItemWrapper)`
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding-left: 0px;
`;

const PriceWrapper = styled(HeaderItemWrapper)`
  display: flex;
  align-items: center;
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

const Label = styled.span`
  font-size: 12px;
  color: #dadada;
`;

const ColoredValue = styled.span<{ color: "green" | "red" }>`
  color: ${({ color }) => (color === "green" ? "#6ED5A3" : "#F86C6B")};
`;
