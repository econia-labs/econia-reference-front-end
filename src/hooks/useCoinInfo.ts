import { StructTag } from "@manahippo/move-to-ts";
import { supply_ } from "sdk/src/stdlib/coin";
import { OptionalAggregator } from "sdk/src/stdlib/optional_aggregator";

import { useQuery } from "react-query";

import { useEconiaSDK } from "./useEconiaSDK";

type CoinInfo = {
  name: string;
  symbol: string;
  decimals: number;
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
      decimals: coin.decimals.toJsNumber(),
    };
  });
};
