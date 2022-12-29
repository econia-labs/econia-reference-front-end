import { StructTag } from "@manahippo/move-to-ts";
import { HexString, MaybeHexString } from "aptos";
import BigNumber from "bignumber.js";

import { useQuery } from "react-query";

import { useEconiaSDK } from "./useEconiaSDK";

export type CoinStore = {
  balance: BigNumber;
};

export const useCoinStore = (
  coinTypeTag: StructTag,
  ownerAddr: MaybeHexString | null | undefined,
) => {
  const { stdlib } = useEconiaSDK();

  return useQuery<CoinStore | null>(
    ["useCoinStore", coinTypeTag, ownerAddr],
    async () => {
      if (!ownerAddr) return null;
      const coinStore = await stdlib.coin.loadCoinStore(
        HexString.ensure(ownerAddr),
        [coinTypeTag],
      );
      return {
        balance: new BigNumber(coinStore.coin.value.toJsNumber()),
      };
    },
  );
};
