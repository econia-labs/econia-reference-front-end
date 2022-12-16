import { StructTag, u8str } from "@manahippo/move-to-ts";

import { useQuery } from "react-query";

import { ECONIA_ADDR } from "../constants";
import { useEconiaSDK } from "./useEconiaSDK";

export type IntegratorFeeStoreTierParameters = {
  fee_share_divisor: number;
  tier_activation_fee: number;
  withdrawal_fee: number;
};

export type IncentiveParams = {
  utilityCoinTypeTag: StructTag;
  marketRegistrationFee: number;
  underwriterRegistrationFee: number;
  custodianRegistrationFee: number;
  takerFeeDivisor: number;
  integratorFeeStoreTiers: IntegratorFeeStoreTierParameters[];
};

export const useIncentiveParams = () => {
  const { econia } = useEconiaSDK();

  return useQuery<IncentiveParams>({
    queryKey: ["useTakerFeeDivisor"],
    queryFn: async () => {
      const params = await econia.incentives.loadIncentiveParameters(
        ECONIA_ADDR,
      );
      return {
        utilityCoinTypeTag: new StructTag(
          params.utility_coin_type_info.account_address,
          u8str(params.utility_coin_type_info.module_name),
          u8str(params.utility_coin_type_info.struct_name),
          [],
        ),
        marketRegistrationFee: params.market_registration_fee.toJsNumber(),
        underwriterRegistrationFee:
          params.underwriter_registration_fee.toJsNumber(),
        custodianRegistrationFee:
          params.custodian_registration_fee.toJsNumber(),
        takerFeeDivisor: params.taker_fee_divisor.toJsNumber(),
        integratorFeeStoreTiers: params.integrator_fee_store_tiers.map(
          (tier) => ({
            fee_share_divisor: tier.fee_share_divisor.toJsNumber(),
            tier_activation_fee: tier.tier_activation_fee.toJsNumber(),
            withdrawal_fee: tier.withdrawal_fee.toJsNumber(),
          }),
        ),
      };
    },
  });
};
