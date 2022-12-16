import { HexString } from "aptos";

import { useQuery } from "react-query";

import { ORDER_BOOKS_ADDR } from "../constants";
import { useAptos } from "./useAptos";
import { useOrderBooks } from "./useOrderBooks";

export const useTakerEvents = (marketId: string | number) => {
  const { aptosClient } = useAptos();
  const orderBooks = useOrderBooks();
  return useQuery({
    queryKey: ["useTakerEvents", marketId],
    queryFn: async () => {
      try {
        const orderBook = orderBooks.data![Number(marketId) - 1];
        const events = await aptosClient
          .getEventsByCreationNumber(
            ORDER_BOOKS_ADDR,
            orderBook.takerEvents.guid.id.creationNum,
          )
          .then((events) =>
            events.map(({ data }) => ({
              custodianId: parseInt(data.custodian_id),
              maker: new HexString(data.maker),
              marketId: parseInt(data.market_id),
              marketOrderId: data.market_order_id.toString(),
              price: parseInt(data.price),
              side: data.side as boolean,
              size: parseInt(data.size),
            })),
          );
        return events;
      } catch (e) {
        // If the vault doesn't exist, return undefined
        console.error(e);
        return null;
      }
    },
    enabled: !!orderBooks.data,
  });
};
