import React, { useRef, useState } from "react";
import { useMemo } from "react";

import { css } from "@emotion/react";

import { Button } from "../../../components/Button";
import { FlexCol } from "../../../components/FlexCol";
import { FlexRow } from "../../../components/FlexRow";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { RadioGroup } from "../../../components/RadioGroup";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { useMarketPrice } from "../../../hooks/useMarketPrice";
import { usePlaceMarketOrder } from "../../../hooks/usePlaceMarketOrder";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";

const BUY = true;
const SELL = false;

export const MarketOrderForm: React.FC<{ market: RegisteredMarket }> = ({
  market,
}) => {
  const [direction, setDirection] = useState(BUY);
  const [amountStr, setAmountStr] = useState("");
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  const marketPrice = useMarketPrice(market);
  const placeMarketOrder = usePlaceMarketOrder();
  const expectedPrice = useMemo(() => {
    if (!marketPrice.data || !baseCoinInfo.data || amountStr === "")
      return null;
    const size = Math.floor(
      (parseFloat(amountStr) * 10 ** baseCoinInfo.data.decimals) /
        market.lotSize,
    );
    return marketPrice.data.getExecutionPrice(size, direction);
  }, [marketPrice.data, amountStr, baseCoinInfo.data]);

  if (
    baseCoinInfo.isLoading ||
    quoteCoinInfo.isLoading ||
    marketPrice.isLoading
  ) {
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
          onChange={(e) => setAmountStr(e.target.value)}
          placeholder="0.0000"
          type="number"
        />
      </div>
      <div
        css={(theme) =>
          css`
            background-color: ${theme.colors.grey[700]};
            width: 228px;
            padding: 8px;
          `
        }
      >
        <FlexRow
          css={css`
            justify-content: space-between;
            align-items: center;
          `}
        >
          <p
            css={(theme) =>
              css`
                color: ${theme.colors.grey[400]};
                font-size: 14px;
              `
            }
          >
            Est. Price
          </p>
          <p>
            {expectedPrice?.executionPrice.toFixed(2) ?? "-"}{" "}
            {quoteCoinInfo.data.symbol}
          </p>
        </FlexRow>
        <FlexRow
          css={css`
            justify-content: space-between;
            align-items: center;
          `}
        >
          <p
            css={(theme) =>
              css`
                color: ${theme.colors.grey[400]};
                font-size: 14px;
              `
            }
          >
            Est. Fill
          </p>
          <p>
            {expectedPrice?.sizeFillable ?? "-"} {baseCoinInfo.data.symbol}
          </p>
        </FlexRow>
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
          // if (direction === BUY) {
          //   depositAmount = size.mul(price).mul(u64(market.tickSize));
          // } else {
          //   depositAmount = size.mul(u64(market.lotSize));
          // }
          // await placeMarketOrder(
          //   depositAmount,
          //   u64(market.marketId),
          //   direction,
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
