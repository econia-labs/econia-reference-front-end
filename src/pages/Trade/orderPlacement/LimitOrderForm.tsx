import { u64 } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import React, { useRef, useState } from "react";

import { css } from "@emotion/react";

import { FlexCol } from "../../../components/FlexCol";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { RadioGroup } from "../../../components/RadioGroup";
import { TxButton } from "../../../components/TxButton";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { usePlaceLimitOrder } from "../../../hooks/usePlaceLimitOrder";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { fromDecimalPrice, fromDecimalSize } from "../../../utils/units";

const ASK = true;
const BID = false;

export const LimitOrderForm: React.FC<{ market: RegisteredMarket }> = ({
  market,
}) => {
  const [side, setSide] = useState(BID);
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  const amountRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const placeLimitOrder = usePlaceLimitOrder();

  if (baseCoinInfo.isLoading || quoteCoinInfo.isLoading) {
    // TODO: Better loading state.
    return <div>Loading...</div>;
  } else if (!baseCoinInfo.data || !quoteCoinInfo.data) {
    // TODO: Better error state.
    return <div>Failed to load coin info.</div>;
  }

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
        value={side === BID ? "Buy" : "Sell"}
        onChange={(value) => (value === "Buy" ? setSide(BID) : setSide(ASK))}
      />
      <div>
        <Label>Amount</Label>
        <Input
          css={css`
            width: 218px;
          `}
          ref={amountRef}
          placeholder="0.0000"
          type="number"
        />
      </div>
      <div>
        <Label>Price</Label>
        <Input
          css={css`
            width: 218px;
          `}
          ref={priceRef}
          placeholder="0.0000"
          type="number"
        />
      </div>
      <TxButton
        onClick={async () => {
          if (!amountRef.current) {
            alert("Amount is required");
            return;
          } else if (!priceRef.current) {
            alert("Price is required");
            return;
          }
          const size = u64(
            fromDecimalSize({
              size: new BigNumber(amountRef.current.value),
              lotSize: market.lotSize,
              baseCoinDecimals: baseCoinInfo.data.decimals,
            }).toFixed(0),
          );
          const price = u64(
            fromDecimalPrice({
              price: new BigNumber(priceRef.current.value),
              lotSize: market.lotSize,
              tickSize: market.tickSize,
              baseCoinDecimals: baseCoinInfo.data.decimals,
              quoteCoinDecimals: quoteCoinInfo.data.decimals,
            }).toFixed(0),
          );

          let depositAmount;
          if (side === BID) {
            depositAmount = size
              .mul(price)
              .mul(u64(market.tickSize.toNumber()));
          } else {
            depositAmount = size.mul(u64(market.lotSize.toNumber()));
          }
          await placeLimitOrder(
            depositAmount,
            u64(market.marketId),
            side,
            size,
            price,
            market.baseType,
            market.quoteType,
          );
        }}
        css={css`
          margin-top: 32px;
        `}
        variant="primary"
        size="sm"
      >
        Place Order
      </TxButton>
    </FlexCol>
  );
};
