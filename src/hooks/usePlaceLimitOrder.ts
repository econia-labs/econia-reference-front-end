import { StructTag, TypeTag, u64 } from "@manahippo/move-to-ts";
import {
  NO_RESTRICTION,
  buildPayload_place_limit_order_user_entry,
  buildPayload_register_market_base_coin_from_coinstore,
} from "sdk/src/econia/market";
import { AptosCoin } from "sdk/src/stdlib/aptos_coin";

import { useCallback } from "react";

import { INTEGRATOR_ADDR } from "../constants";
import { useAptos } from "./useAptos";

const DEFAULT_LOT_SIZE = u64(1);
const DEFAULT_TICK_SIZE = u64(1);
const DEFAULT_MIN_SIZE = u64(1);
const DEFAULT_UTILITY_COIN_TYPE = AptosCoin.getTag();

export const usePlaceLimitOrder = () => {
  const { sendTx } = useAptos();
  return useCallback(
    async (
      marketId: string | number,
      isBuyOrder: boolean,
      size: string | number,
      price: string | number,
      baseCoin: TypeTag,
      quoteCoin: TypeTag,
    ) => {
      const payload = buildPayload_place_limit_order_user_entry(
        u64(marketId),
        INTEGRATOR_ADDR,
        isBuyOrder,
        u64(size),
        u64(price),
        NO_RESTRICTION, // TODO: Restrictions
        [baseCoin, quoteCoin, DEFAULT_UTILITY_COIN_TYPE],
      );
      await sendTx(payload);
    },
    [sendTx],
  );
};
