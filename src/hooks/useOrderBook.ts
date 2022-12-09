import { u64 } from "@manahippo/move-to-ts";
import { query_index_orders_sdk } from "sdk/src/econia/market";

import { useQuery } from "react-query";

import { ECONIA_SIMULATION_KEYS } from "../constants";
import { useAptos } from "./useAptos";
import { useEconiaSDK } from "./useEconiaSDK";
import { useOrderBooks } from "./useOrderBooks";

export const useOrderBook = (marketId: string | number) => {
  const { aptosClient } = useAptos();
  const orderBooks = useOrderBooks();
  const sdk = useEconiaSDK();

  return useQuery({
    queryKey: ["useOrderBook", marketId],
    queryFn: async () => {
      const orders = await query_index_orders_sdk(
        aptosClient,
        ECONIA_SIMULATION_KEYS,
        sdk.repo,
        u64(marketId),
        [],
      );
      console.log(orders);
      // const orderBook = await aptosClient
      //   .getTableItem(orderBooks.data!.map.table.inner.handle.toString(), {
      //     key: marketId.toString(),
      //     key_type: "u64",
      //     value_type: Node.makeTag([
      //       AtomicTypeTag.U64,
      //       OrderBook.getTag(),
      //     ]).getFullname(),
      //   })
      //   .then(({ value }) => value);
      // console.log(orderBook);
    },
    enabled: !!orderBooks.data,
  });
};
