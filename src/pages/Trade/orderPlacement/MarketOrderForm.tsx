import { u64 } from "@manahippo/move-to-ts";

import React, { useRef, useState } from "react";
import { useMemo } from "react";

import { css } from "@emotion/react";

import { Button } from "../../../components/Button";
import { FlexCol } from "../../../components/FlexCol";
import { FlexRow } from "../../../components/FlexRow";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { RadioGroup } from "../../../components/RadioGroup";
import { BUY, SELL, ZERO_U64 } from "../../../constants";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { useIncentiveParams } from "../../../hooks/useIncentiveParams";
import { useMarketPrice } from "../../../hooks/useMarketPrice";
import { usePlaceMarketOrder } from "../../../hooks/usePlaceMarketOrder";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { calculate_max_quote_match_ } from "../../../sdk/src/econia/incentives";
import { HI_PRICE, MAX_POSSIBLE } from "../../../sdk/src/econia/market";

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
    const size = Math.floor(
      (parseFloat(amountStr) * 10 ** baseCoinInfo.data.decimals) /
        market.lotSize,
    );
    return marketPrice.data.getExecutionPrice(size, direction);
  }, [marketPrice.data, amountStr, baseCoinInfo.data, direction]);

  if (
    baseCoinInfo.isLoading ||
    quoteCoinInfo.isLoading ||
    marketPrice.isLoading ||
    incentiveParams.isLoading
  ) {
    // TODO: Better loading state.
    return <div>Loading...</div>;
  } else if (
    !baseCoinInfo.data ||
    !quoteCoinInfo.data ||
    !incentiveParams.data
  ) {
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
        disabled={!expectedPrice}
        onClick={async () => {
          const size = u64(
            Math.floor(
              (expectedPrice!.sizeFillable * 10 ** baseCoinInfo.data.decimals) /
                market.lotSize,
            ),
          );
          const pricePerUnit = u64(
            Math.floor(
              (expectedPrice!.executionPrice *
                10 ** quoteCoinInfo.data.decimals) /
                market.tickSize,
            ),
          );
          // AKA pricePerLot
          const price = pricePerUnit
            .mul(u64(market.lotSize))
            .div(u64(10 ** baseCoinInfo.data.decimals));
          // AKA total number of ticks transacted
          const quote = calculate_max_quote_match_(
            direction,
            u64(incentiveParams.data.takerFeeDivisor),
            size.mul(price),
            undefined!,
          );

          let depositAmount;
          if (direction === BUY) {
            depositAmount = size.mul(price).mul(u64(market.tickSize));
          } else {
            depositAmount = size.mul(u64(market.lotSize));
          }
          // TODO: Handle slippage
          await placeMarketOrder(
            depositAmount,
            u64(market.marketId),
            direction,
            size, // min_base
            MAX_POSSIBLE, // max_base
            quote, // min_quote
            MAX_POSSIBLE, // max_quote
            direction === BUY ? HI_PRICE : ZERO_U64,
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
      </Button>
    </FlexCol>
  );
};
