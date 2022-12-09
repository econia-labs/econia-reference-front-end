import { SimulationKeys } from "@manahippo/move-to-ts";
import { HexString } from "aptos";
import { moduleAddress as econiaAddr } from "sdk/src/econia/registry";

export const ORDER_BOOKS_ADDR = new HexString(
  "0xd62efe576ed25f7e98cc21102543ebd06949fbfeb3903a703cb013fe9f580baf",
);

export const ECONIA_ADDR = econiaAddr;

export const ECONIA_SIMULATION_KEYS: SimulationKeys = {
  pubkey: new HexString(
    "0x31e13f3724737e056651f66d7c573bb8d3adb1b284b65abda16855864b17906f",
  ),
  address: econiaAddr,
};
