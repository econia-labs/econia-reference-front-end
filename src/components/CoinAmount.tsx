import BigNumber from "bignumber.js";

import React from "react";

import { css } from "@emotion/react";

import { CoinSymbol } from "./CoinSymbol";

export const CoinAmount: React.FC<{
  amount: BigNumber | null | undefined;
  symbol: string | null | undefined;
}> = ({ amount, symbol }) => {
  return (
    <span>
      <p
        css={css`
          display: inline;
        `}
      >
        {amount?.toNumber() ?? "-"}
      </p>{" "}
      <CoinSymbol symbol={symbol} />
    </span>
  );
};
