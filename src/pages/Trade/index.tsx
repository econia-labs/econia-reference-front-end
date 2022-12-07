import { DEFAULT_TESTNET_LIST, RawCoinInfo } from "@manahippo/coin-list";
import { FlexCol } from "components/FlexCol";
import { FlexRow } from "components/FlexRow";
import { TradeActions } from "pages/Trade/TradeActions";
import { TradeHeader } from "pages/Trade/TradeHeader";

import React from "react";

import { css } from "@emotion/react";

import { TradeChart } from "./TradeChart";

export const Trade: React.FC = () => {
  const marketCoin: RawCoinInfo = DEFAULT_TESTNET_LIST[0];
  const quoteCoin: RawCoinInfo = DEFAULT_TESTNET_LIST[1];
  return (
    <FlexCol
      css={css`
        height: 100%;
      `}
    >
      <TradeHeader marketCoin={marketCoin} quoteCoin={quoteCoin} />
      <FlexRow
        css={css`
          flex-grow: 1;
        `}
      >
        <TradeActions marketCoin={marketCoin} quoteCoin={quoteCoin} />
        <TradeChart
          css={css`
            flex-grow: 1;
          `}
          marketCoin={marketCoin}
          quoteCoin={quoteCoin}
        />
      </FlexRow>
    </FlexCol>
  );
};
