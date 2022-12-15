import { StructTag } from "@manahippo/move-to-ts";
import { HexString } from "aptos";

import { useQuery } from "react-query";

import { Registry } from "../sdk/src/econia/registry";
import { moduleAddress } from "../sdk/src/econia/registry";
import { hexToUtf8 } from "../utils/string";
import { useAptos } from "./useAptos";

export type RegisteredMarket = {
  baseNameGeneric: string;
  baseType: StructTag;
  lotSize: number;
  marketId: number;
  minSize: number;
  quoteType: StructTag;
  tickSize: number;
  underwriterId: number;
};

export const useRegisteredMarkets = () => {
  const { aptosClient } = useAptos();

  return useQuery(["useRegisteredMarkets"], async () => {
    const events = await aptosClient.getEventsByEventHandle(
      moduleAddress,
      Registry.getTag().getFullname(),
      "market_registration_events",
    );
    return events
      .map(({ data }) => ({
        baseNameGeneric: data.base_name_generic,
        baseType: new StructTag(
          new HexString(data.base_type.account_address),
          hexToUtf8(data.base_type.module_name),
          hexToUtf8(data.base_type.struct_name),
          [],
        ),
        lotSize: parseInt(data.lot_size),
        marketId: parseInt(data.market_id),
        minSize: parseInt(data.min_size),
        quoteType: new StructTag(
          new HexString(data.quote_type.account_address),
          hexToUtf8(data.quote_type.module_name),
          hexToUtf8(data.quote_type.struct_name),
          [],
        ),
        tickSize: parseInt(data.tick_size),
        underwriterId: parseInt(data.underwriter_id),
      }))
      .reverse(); // TODO: Better default ordering
  });
};
