import { RawCoinInfo } from "@manahippo/coin-list";
import { Label } from "components/Label";
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
  border-right: 1px solid ${({ theme }) => theme.colors.grey[700]};
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

const ColoredValue = styled.span<{ color: "green" | "red" }>`
  color: ${({ color, theme }) =>
    color === "green" ? theme.colors.green.primary : "#F86C6B"};
`;
