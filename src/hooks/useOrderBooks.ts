import { useQuery } from "react-query";

import { ORDER_BOOKS_ADDR } from "../constants";
import { useEconiaSDK } from "./useEconiaSDK";

export const useOrderBooks = () => {
  const { econia } = useEconiaSDK();

  return useQuery(["useOrderBooks"], async () => {
    return await econia.market.loadOrderBooks(ORDER_BOOKS_ADDR, false);
  });
};
