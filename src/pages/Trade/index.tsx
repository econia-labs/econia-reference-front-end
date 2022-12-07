import { DEFAULT_TESTNET_LIST, RawCoinInfo } from "@manahippo/coin-list";
import { FlexCol } from "components/FlexCol";
import { TradeActions } from "pages/Trade/TradeActions";
import { TradeHeader } from "pages/Trade/TradeHeader";

import React from "react";

import { css } from "@emotion/react";

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
      <TradeActions
        css={css`
          flex-grow: 1;
        `}
        marketCoin={marketCoin}
        quoteCoin={quoteCoin}
      />
    </FlexCol>
  );
};
