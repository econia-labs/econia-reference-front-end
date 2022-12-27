import { SimulationKeys, u64 } from "@manahippo/move-to-ts";
import { HexString } from "aptos";

import { moduleAddress as econiaAddr } from "./sdk/src/econia/registry";

export const ORDER_BOOKS_ADDR = new HexString(
  "0xd62efe576ed25f7e98cc21102543ebd06949fbfeb3903a703cb013fe9f580baf",
);

export const ECONIA_ADDR = econiaAddr;

export const ECONIA_SIMULATION_KEYS: SimulationKeys = {
  pubkey: new HexString(
    "0x86a82c05d5d89b65e684db85cfb77e8475d99b97ef31de5ae8bdf6152b2f3974",
  ),
  address: econiaAddr,
};

// NOTE: Change this address to receive fees
export const INTEGRATOR_ADDR = new HexString(
  "0x2e51979739db25dc987bd24e1a968e45cca0e0daea7cae9121f68af93e8884c9",
);

export const ASK = true;
export const BID = false;
export const SELL = true;
export const BUY = false;

export const ZERO_U64 = u64(0);
