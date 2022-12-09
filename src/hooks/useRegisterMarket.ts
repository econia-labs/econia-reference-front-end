import { StructTag, TypeTag, u64 } from "@manahippo/move-to-ts";
import { buildPayload_register_market_base_coin_from_coinstore } from "sdk/src/econia/market";
import { AptosCoin } from "sdk/src/stdlib/aptos_coin";

import { useCallback } from "react";

import { useAptos } from "./useAptos";

const DEFAULT_LOT_SIZE = u64(1);
const DEFAULT_TICK_SIZE = u64(1);
const DEFAULT_MIN_SIZE = u64(1);
const DEFAULT_UTILITY_COIN_TYPE = AptosCoin.getTag();

export const useRegisterMarket = () => {
  const { sendTx } = useAptos();
  return useCallback(
    async (baseCoin: TypeTag, quoteCoin: TypeTag) => {
      const payload = buildPayload_register_market_base_coin_from_coinstore(
        DEFAULT_LOT_SIZE,
        DEFAULT_TICK_SIZE,
        DEFAULT_MIN_SIZE,
        [baseCoin, quoteCoin, DEFAULT_UTILITY_COIN_TYPE],
      );
      await sendTx(payload);
    },
    [sendTx],
  );
};
