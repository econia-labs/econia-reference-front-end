import { u64 } from "@manahippo/move-to-ts";

import { useQuery } from "react-query";

import { ECONIA_SIMULATION_KEYS } from "../constants";
import { query_index_orders_sdk } from "../sdk/src/econia/market";
import { useAptos } from "./useAptos";
import { useEconiaSDK } from "./useEconiaSDK";
import { useOrderBooks } from "./useOrderBooks";

export const useOrderBook = (marketId: string | number) => {
  const { aptosClient } = useAptos();
  const orderBooks = useOrderBooks();
  const { econia } = useEconiaSDK();

  return useQuery({
    queryKey: ["useOrderBook", marketId],
    queryFn: async () => {
      return await query_index_orders_sdk(
        aptosClient,
        ECONIA_SIMULATION_KEYS,
        econia.repo,
        u64(marketId),
        [],
      );
    },
    enabled: !!orderBooks.data,
  });
};
