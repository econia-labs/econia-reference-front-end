import { StructTag } from "@manahippo/move-to-ts";
import { HexString, MaybeHexString } from "aptos";
import BigNumber from "bignumber.js";

import { useQuery } from "react-query";

import { toDecimalCoin } from "../utils/units";
import { useEconiaSDK } from "./useEconiaSDK";

export type CoinStore = {
  balance: BigNumber;
  symbol: string;
  decimals: BigNumber;
};

export const useCoinStore = (
  coinTypeTag: StructTag | null | undefined,
  ownerAddr: MaybeHexString | null | undefined,
) => {
  const { stdlib } = useEconiaSDK();

  return useQuery<CoinStore | null>(
    ["useCoinStore", coinTypeTag, ownerAddr],
    async () => {
      if (!ownerAddr || !coinTypeTag) return null;
      try {
        const coinStore = await stdlib.coin.loadCoinStore(
          HexString.ensure(ownerAddr),
          [coinTypeTag],
        );
        // TODO: Don't double fetch this
        const coinInfo = await stdlib.coin.loadCoinInfo(coinTypeTag.address, [
          coinTypeTag,
        ]);
        return {
          balance: toDecimalCoin({
            amount: new BigNumber(coinStore.coin.value.toJsNumber()),
            decimals: new BigNumber(coinInfo.decimals.toJsNumber()),
          }),
          symbol: coinInfo.symbol.str(),
          decimals: new BigNumber(coinInfo.decimals.toJsNumber()),
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    },
  );
};
