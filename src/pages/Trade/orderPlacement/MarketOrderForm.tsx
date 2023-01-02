import { u64 } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import React, { useState } from "react";
import { useMemo } from "react";

import { css } from "@emotion/react";

import { FlexCol } from "../../../components/FlexCol";
import { FlexRow } from "../../../components/FlexRow";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Loading } from "../../../components/Loading";
import { RadioGroup } from "../../../components/RadioGroup";
import { TxButton } from "../../../components/TxButton";
import { BUY, SELL, ZERO_U64 } from "../../../constants";
import { useCoinInfo } from "../../../hooks/useCoinInfo";
import { useIncentiveParams } from "../../../hooks/useIncentiveParams";
import { useMarketPrice } from "../../../hooks/useMarketPrice";
import { usePlaceMarketOrder } from "../../../hooks/usePlaceMarketOrder";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { calculate_max_quote_match_ } from "../../../sdk/src/econia/incentives";
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
            {expectedPrice?.sizeFillable.toNumber() ?? "-"}{" "}
            {baseCoinInfo.data.symbol}
          </p>
        </FlexRow>
      </div>
      <TxButton
        onClick={async () => {
          if (!expectedPrice) return;
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
          const quote = calculate_max_quote_match_(
            direction,
            u64(incentiveParams.data.takerFeeDivisor.toNumber()),
            size.mul(price),
            undefined!,
          );

          let depositAmount;
          if (direction === BUY) {
            // Give an extra 0.1% to account for rounding errors.
            // TODO: Find a better way to handle this.
            depositAmount = quote
              .mul(u64(market.tickSize.toNumber()))
              .mul(u64(100_1))
              .div(u64(100_0));
          } else {
            depositAmount = size.mul(u64(market.lotSize.toNumber()));
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
