import { StructTag } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import { useQuery } from "react-query";

import { App as StdLib } from "../sdk/src/stdlib";
import { useEconiaSDK } from "./useEconiaSDK";

export type CoinInfo = {
  name: string;
  symbol: string;
  decimals: BigNumber;
};

export const useCoinInfo = (coinTypeTag: StructTag) => {
  const { stdlib } = useEconiaSDK();

  return useQuery<CoinInfo>(["useCoinInfo", coinTypeTag], async () => {
    const coin = await stdlib.coin.loadCoinInfo(coinTypeTag.address, [
      coinTypeTag,
    ]);
    return {
      name: coin.name.str(),
      symbol: coin.symbol.str(),
      decimals: new BigNumber(coin.decimals.toJsNumber()),
    };
  });
};
