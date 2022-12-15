import React, { useRef, useState } from "react";

import { css } from "@emotion/react";

import { Button } from "../../../components/Button";
import { FlexCol } from "../../../components/FlexCol";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { RadioGroup } from "../../../components/RadioGroup";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { usePlaceMarketOrder } from "../../../hooks/usePlaceMarketOrder";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";

const BUY = true;
const SELL = false;

export const MarketOrderForm: React.FC<{ market: RegisteredMarket }> = ({
  market,
}) => {
  const [side, setSide] = useState(BUY);
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  const amountRef = useRef<HTMLInputElement>(null);
  const placeMarketOrder = usePlaceMarketOrder();

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
        value={side === BUY ? "Buy" : "Sell"}
        onChange={(value) => (value === "Buy" ? setSide(BUY) : setSide(SELL))}
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
      <Button
        onClick={async () => {
          // TODO: Need market price to implement (min|max)_base and (min|max)_quote
          // if (!amountRef.current) {
          //   alert("Amount is required");
          //   return;
          // }
          // // TODO: Work out the correct lot size and price
          // const size = u64(
          //   Math.floor(
          //     (parseFloat(amountRef.current.value) *
          //       10 ** baseCoinInfo.data.decimals) /
          //       market.lotSize,
          //   ),
          // );
          // const pricePerUnit = u64(
          //   Math.floor(
          //     (parseFloat(priceRef.current.value) *
          //       10 ** quoteCoinInfo.data.decimals) /
          //       market.tickSize,
          //   ),
          // );
          // // TODO: This only works if the lotSize is <= 1 unit
          // const lotsPerUnit = u64(10 ** baseCoinInfo.data.decimals).div(
          //   u64(market.lotSize),
          // );
          // // AKA pricePerLot
          // const price = pricePerUnit.div(lotsPerUnit);
          // let depositAmount;
          // if (side === BUY) {
          //   depositAmount = size.mul(price).mul(u64(market.tickSize));
          // } else {
          //   depositAmount = size.mul(u64(market.lotSize));
          // }
          // await placeMarketOrder(
          //   depositAmount,
          //   u64(market.marketId),
          //   side,
          //   size,
          //   price,
          //   market.baseType,
          //   market.quoteType,
          // );
        }}
        css={css`
          margin-top: 32px;
        `}
        variant="primary"
        size="sm"
      >
        Place Order
      </Button>
    </FlexCol>
  );
};
