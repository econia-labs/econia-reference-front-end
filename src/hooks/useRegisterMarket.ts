import { TypeTag, u64 } from "@manahippo/move-to-ts";

import { useCallback } from "react";

import { buildPayload_register_market_base_coin_from_coinstore } from "../sdk/src/econia/market";
import { AptosCoin } from "../sdk/src/stdlib/aptos_coin";
import { useAptos } from "./useAptos";

const DEFAULT_UTILITY_COIN_TYPE = AptosCoin.getTag();

export const useRegisterMarket = () => {
  const { sendTx } = useAptos();
  return useCallback(
    async (baseCoin: TypeTag, quoteCoin: TypeTag) => {
      const lotSize = prompt("Enter lot size");
      const tickSize = prompt("Enter tick size");
      const minSize = prompt("Enter min size");
      if (!lotSize || !tickSize || !minSize) {
        alert("Invalid input");
        return;
      }
      const payload = buildPayload_register_market_base_coin_from_coinstore(
        u64(parseInt(lotSize)),
        u64(parseInt(tickSize)),
        u64(parseInt(minSize)),
        [baseCoin, quoteCoin, DEFAULT_UTILITY_COIN_TYPE],
      );
      await sendTx(payload);
    },
    [sendTx],
  );
};
