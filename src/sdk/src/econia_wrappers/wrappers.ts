import * as $ from "@manahippo/move-to-ts";
import {AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache} from "@manahippo/move-to-ts";
import {U8, U64, U128} from "@manahippo/move-to-ts";
import {u8, u64, u128} from "@manahippo/move-to-ts";
import {TypeParamDeclType, FieldDeclType} from "@manahippo/move-to-ts";
import {AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag} from "@manahippo/move-to-ts";
import {OptionTransaction} from "@manahippo/move-to-ts";
import {HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types} from "aptos";
import * as Econia from "../econia";
import * as Stdlib from "../stdlib";
export const packageName = "Econia Wrappers";
export const moduleAddress = new HexString("0x7c36a610d1cde8853a692c057e7bd2479ba9d5eeaeceafa24f125c23d2abf942");
export const moduleName = "wrappers";

export const BUY : boolean = true;
export const NO_CUSTODIAN : U64 = u64("0");
export const SHIFT_MARKET_ID : U8 = u8("64");

export function place_limit_order_user_entry_ (
  user: HexString,
  deposit_amount: U64,
  market_id: U64,
  integrator: HexString,
  side: boolean,
  size: U64,
  price: U64,
  restriction: U8,
  $c: AptosDataCache,
  $p: TypeTag[], /* <BaseType, QuoteType>*/
): void {
  let user_market_account_id;
  user_market_account_id = (u128($.copy(market_id))).shl($.copy(SHIFT_MARKET_ID));
  if (!Econia.User.has_market_account_by_market_account_id_(Stdlib.Signer.address_of_(user, $c), $.copy(user_market_account_id), $c)) {
    Econia.User.register_market_account_(user, $.copy(market_id), $.copy(NO_CUSTODIAN), $c, [$p[0], $p[1]]);
  }
  else{
  }
  if ((side == $.copy(BUY))) {
    Econia.User.deposit_from_coinstore_(user, $.copy(market_id), $.copy(NO_CUSTODIAN), $.copy(deposit_amount), $c, [$p[1]]);
  }
  else{
    Econia.User.deposit_from_coinstore_(user, $.copy(market_id), $.copy(NO_CUSTODIAN), $.copy(deposit_amount), $c, [$p[0]]);
  }
  Econia.Market.place_limit_order_user_entry_(user, $.copy(market_id), $.copy(integrator), side, $.copy(size), $.copy(price), $.copy(restriction), $c, [$p[0], $p[1]]);
  return;
}


export function buildPayload_place_limit_order_user_entry (
  deposit_amount: U64,
  market_id: U64,
  integrator: HexString,
  side: boolean,
  size: U64,
  price: U64,
  restriction: U8,
  $p: TypeTag[], /* <BaseType, QuoteType>*/
  isJSON = false,
): TxnBuilderTypes.TransactionPayloadEntryFunction
   | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map(t=>$.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString("0x7c36a610d1cde8853a692c057e7bd2479ba9d5eeaeceafa24f125c23d2abf942"),
    "wrappers",
    "place_limit_order_user_entry",
    typeParamStrings,
    [
      deposit_amount,
      market_id,
      integrator,
      side,
      size,
      price,
      restriction,
    ],
    isJSON,
  );

}

export function loadParsers(repo: AptosParserRepo) {
}
export class App {
  constructor(
    public client: AptosClient,
    public repo: AptosParserRepo,
    public cache: AptosLocalCache,
  ) {
  }
  get moduleAddress() {{ return moduleAddress; }}
  get moduleName() {{ return moduleName; }}
  payload_place_limit_order_user_entry(
    deposit_amount: U64,
    market_id: U64,
    integrator: HexString,
    side: boolean,
    size: U64,
    price: U64,
    restriction: U8,
    $p: TypeTag[], /* <BaseType, QuoteType>*/
    isJSON = false,
  ): TxnBuilderTypes.TransactionPayloadEntryFunction
        | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_place_limit_order_user_entry(deposit_amount, market_id, integrator, side, size, price, restriction, $p, isJSON);
  }
  async place_limit_order_user_entry(
    _account: AptosAccount,
    deposit_amount: U64,
    market_id: U64,
    integrator: HexString,
    side: boolean,
    size: U64,
    price: U64,
    restriction: U8,
    $p: TypeTag[], /* <BaseType, QuoteType>*/
    option?: OptionTransaction,
    _isJSON = false
  ) {
    const payload__ = buildPayload_place_limit_order_user_entry(deposit_amount, market_id, integrator, side, size, price, restriction, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload__, option);
  }
}

