import { u64 } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import React, { useState } from "react";
import { useMemo } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FlexCol } from "../../../components/FlexCol";
import { FlexRow } from "../../../components/FlexRow";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Loading } from "../../../components/Loading";
import { RadioGroup } from "../../../components/RadioGroup";
import { TxButton } from "../../../components/TxButton";
import {
  BPS_DENOMINATOR,
  BUY,
  DEFAULT_SLIPPAGE_BPS,
  SELL,
  ZERO_U64,
} from "../../../constants";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { useIncentiveParams } from "../../../hooks/useIncentiveParams";
import { useMarketPrice } from "../../../hooks/useMarketPrice";
import { usePlaceMarketOrder } from "../../../hooks/usePlaceMarketOrder";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { HI_PRICE, MAX_POSSIBLE } from "../../../sdk/src/econia/market";
import { fromDecimalPrice, fromDecimalSize } from "../../../utils/units";

export const MarketOrderForm: React.FC<{ market: RegisteredMarket }> = ({
  market,
}) => {
  const [direction, setDirection] = useState(BUY);
  const [amountStr, setAmountStr] = useState("");
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  const marketPrice = useMarketPrice(market);
  const incentiveParams = useIncentiveParams();
  const placeMarketOrder = usePlaceMarketOrder();
  const expectedPrice = useMemo(() => {
    if (!marketPrice.data || !baseCoinInfo.data || amountStr === "")
      return null;
    const size = fromDecimalSize({
      size: new BigNumber(amountStr),
      lotSize: market.lotSize,
      baseCoinDecimals: baseCoinInfo.data.decimals,
    });
    return marketPrice.data.getExecutionPrice(size, direction);
  }, [marketPrice.data, amountStr, baseCoinInfo.data, direction]);

  if (
    baseCoinInfo.isLoading ||
    quoteCoinInfo.isLoading ||
    marketPrice.isLoading ||
    incentiveParams.isLoading
  ) {
    // TODO: Better loading state.
    return <Loading />;
  } else if (
    !baseCoinInfo.data ||
    !quoteCoinInfo.data ||
    !incentiveParams.data
  ) {
    // TODO: Better error state.
    return <div>Failed to load coin info.</div>;
  }

  const disabledReason = amountStr === "" ? "Enter an amount" : undefined;

  return (
    <FlexCol
      css={css`
        align-items: center;
        gap: 16px;
        label {
          margin-bottom: 4px;
        }
      `}
    >
      <RadioGroup
        css={(theme) => css`
          border: 1px solid ${theme.colors.grey[700]};
          width: 240px;
        `}
        options={["Buy", "Sell"]}
        value={direction === BUY ? "Buy" : "Sell"}
        onChange={(value) =>
          value === "Buy" ? setDirection(BUY) : setDirection(SELL)
        }
      />
      <div>
        <Label>Amount</Label>
        <Input
          css={css`
            width: 218px;
          `}
          min={0}
          onChange={(e) => setAmountStr(e.target.value)}
          placeholder="0.0000"
          type="number"
        />
      </div>

      <DetailsContainer>
        <FlexRow
          css={css`
            justify-content: space-between;
            align-items: center;
          `}
        >
          <p>Est. Price</p>
          <p>
            {expectedPrice?.executionPrice.toNumber() ?? "-"}{" "}
            {quoteCoinInfo.data.symbol}
          </p>
        </FlexRow>
        <FlexRow
          css={css`
            justify-content: space-between;
            align-items: center;
          `}
        >
          <p>Est. Fill</p>
          <p>
            {expectedPrice?.sizeFillable.toNumber() ?? "-"}{" "}
            {baseCoinInfo.data.symbol}
          </p>
        </FlexRow>
      </DetailsContainer>

      <TxButton
        onClick={async () => {
          if (!expectedPrice || !baseCoinInfo.data || !quoteCoinInfo.data)
            return;
          const size = u64(
            fromDecimalSize({
              size: expectedPrice!.sizeFillable,
              lotSize: market.lotSize,
              baseCoinDecimals: baseCoinInfo.data.decimals,
            }).toFixed(0),
          );
          const price = u64(
            fromDecimalPrice({
              price: expectedPrice!.executionPrice,
              lotSize: market.lotSize,
              tickSize: market.tickSize,
              baseCoinDecimals: baseCoinInfo.data.decimals,
              quoteCoinDecimals: quoteCoinInfo.data.decimals,
            }).toFixed(0),
          );

          let depositAmount;
          if (direction === BUY) {
            // Give an extra 0.1% to ensure MarketAccount has enough funds to place the order.
            const baseAmount = size
              .mul(price)
              .mul(u64(market.tickSize.toNumber()));
            const feeAmount = size.div(
              u64(incentiveParams.data.takerFeeDivisor.toNumber()),
            );
            depositAmount = baseAmount
              .add(feeAmount)
              .mul(BPS_DENOMINATOR.add(DEFAULT_SLIPPAGE_BPS))
              .div(BPS_DENOMINATOR);
          } else {
            depositAmount = size.mul(u64(market.lotSize.toNumber()));
          }
          await placeMarketOrder(
            depositAmount,
            u64(market.marketId),
            direction,
            size, // min_base
            MAX_POSSIBLE, // max_base TODO: should be `size
            ZERO_U64, // min_quote
            MAX_POSSIBLE, // max_quote
            direction === BUY ? HI_PRICE : ZERO_U64, // limit_price
            market.baseType,
            market.quoteType,
          );
        }}
        css={css`
          margin-top: 32px;
          width: 200px;
        `}
        variant="primary"
        size="sm"
        disabled={!expectedPrice || !!disabledReason}
      >
        {disabledReason ? disabledReason : "Place Order"}
      </TxButton>
    </FlexCol>
  );
};

const DetailsContainer = styled(FlexCol)`
  width: 100%;
  font-size: 12px;
  font-weight: 300;
  gap: 8px;
`;
