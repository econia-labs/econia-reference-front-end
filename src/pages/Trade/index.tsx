import { DEFAULT_TESTNET_LIST, RawCoinInfo } from "@manahippo/coin-list";

import React from "react";

import { TradeHeader } from "./TradeHeader";

export const Trade: React.FC = () => {
  const marketCoin: RawCoinInfo = DEFAULT_TESTNET_LIST[0];
  const quoteCoin: RawCoinInfo = DEFAULT_TESTNET_LIST[1];
  return (
    <>
      <TradeHeader marketCoin={marketCoin} quoteCoin={quoteCoin} />
    </>
  );
};
