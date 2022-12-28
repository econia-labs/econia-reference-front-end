import { u64 } from "@manahippo/move-to-ts";
import { exec } from "child_process";

import React, { FormEvent, useCallback, useMemo, useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Button } from "../../components/Button";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { MarketDropdown } from "../../components/MarketDropdown";
import { BUY, ZERO_U64 } from "../../constants";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useIncentiveParams } from "../../hooks/useIncentiveParams";
import { useMarketPrice } from "../../hooks/useMarketPrice";
import { usePlaceSwap } from "../../hooks/usePlaceSwap";
import {
  RegisteredMarket,
  useRegisteredMarkets,
} from "../../hooks/useRegisteredMarkets";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { DefaultWrapper } from "../../layout/DefaultWrapper";
import { calculate_max_quote_match_ } from "../../sdk/src/econia/incentives";
import { MAX_POSSIBLE } from "../../sdk/src/econia/market";
import { HI_PRICE } from "../../sdk/src/econia/user";
import { fromDecimalPrice } from "../../utils/units";

export const Swap: React.FC = () => {
  const registeredMarkets = useRegisteredMarkets();

  return (
    <DefaultWrapper
      css={css`
        height: 100%;
      `}
    >
      <DefaultContainer
        css={css`
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `}
      >
        <SwapContainer>
          {registeredMarkets.data && registeredMarkets.data.length > 0 ? (
            <SwapInner markets={registeredMarkets.data} />
          ) : (
            <p>Loading...</p>
          )}
        </SwapContainer>
      </DefaultContainer>
    </DefaultWrapper>
  );
};

// Precondition: markets is not empty
const SwapInner: React.FC<{
  markets: RegisteredMarket[];
}> = ({ markets }) => {
  const [inputAmount, setInputAmount] = useState("");
  const [market, setMarket] = useState<RegisteredMarket>(markets[0]);
  const [direction, setDirection] = useState(BUY);
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  const marketPrice = useMarketPrice(market);
  const incentiveParams = useIncentiveParams();
  const placeSwap = usePlaceSwap();
  const onInputChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      setInputAmount(e.currentTarget.value);
    },
    [setInputAmount],
  );
  const { outputAmount, executionPrice, disabledReason } = useMemo(() => {
    if (inputAmount === "")
      return {
        outputAmount: "",
        executionPrice: undefined,
        disabledReason: "Enter an amount",
      };
    if (!marketPrice.data || !baseCoinInfo.data || !quoteCoinInfo.data)
      return { outputAmount: "", disabledReason: "Loading..." };

    let sizeFillable, executionPrice;
    if (direction === BUY) {
      const quote = Math.floor(
        (parseFloat(inputAmount) * 10 ** quoteCoinInfo.data.decimals) /
          market.tickSize,
      );
      if (quote > marketPrice.data.maxBuyQuote) {
        return {
          outputAmount: "",
          executionPrice,
          disabledReason: "Input exceeds liquidity",
        };
      }
      const res = marketPrice.data.getExecutionPriceQuote(quote, direction);
      ({ sizeFillable, executionPrice } = res);
      console.log(sizeFillable, executionPrice);
    } else {
      const size = Math.floor(
        (parseFloat(inputAmount) * 10 ** baseCoinInfo.data.decimals) /
          market.lotSize,
      );
      if (size > marketPrice.data.maxSellSize) {
        return {
          outputAmount: "",
          executionPrice,
          disabledReason: "Input exceeds liquidity",
        };
      }
      const res = marketPrice.data.getExecutionPrice(size, direction);
      ({ sizeFillable, executionPrice } = res);
    }
    if (sizeFillable === 0) {
      return {
        outputAmount: "",
        executionPrice,
        disabledReason: "Input too small",
      };
    }
    const outputAmount = sizeFillable.toFixed(4);
    return {
      outputAmount,
      executionPrice,
      disabledReason: false,
    };
  }, [inputAmount, marketPrice.data, baseCoinInfo.data, direction]);

  if (
    baseCoinInfo.isLoading ||
    quoteCoinInfo.isLoading ||
    marketPrice.isLoading ||
    incentiveParams.isLoading ||
    !marketPrice.data ||
    !incentiveParams.data
  ) {
    // TODO: Better loading state
    return <DefaultWrapper>Loading...</DefaultWrapper>;
  } else if (!baseCoinInfo.data || !quoteCoinInfo.data) {
    // TODO: Better error state
    return <DefaultWrapper>Error loading coin info</DefaultWrapper>;
  }

  return (
    <>
      <h2>Swap</h2>
      <div
        css={css`
          width: 100%;
        `}
      >
        <Label
          css={css`
            margin-bottom: 4px;
          `}
        >
          Market
        </Label>
        <MarketDropdown
          markets={markets}
          setSelectedMarket={setMarket}
          dropdownLabel={`${baseCoinInfo.data?.symbol} / ${quoteCoinInfo.data?.symbol}`}
        />
      </div>
      <div
        css={css`
          width: 100%;
        `}
      >
        <Label>Input</Label>
        <FlexRow
          css={css`
            align-items: center;
            gap: 8px;
          `}
        >
          <Input
            css={css`
              width: 218px;
            `}
            placeholder="0.0000"
            value={inputAmount}
            onChange={onInputChange}
            type="number"
          />
          <p>
            {direction === BUY
              ? quoteCoinInfo.data?.symbol
              : baseCoinInfo.data?.symbol}
          </p>
        </FlexRow>
      </div>
      <div
        css={(theme) => css`
          padding: 4px 8px;
          cursor: pointer;
          :hover {
            background-color: ${theme.colors.grey[600]};
          }
        `}
        onClick={() => setDirection(!direction)}
      >
        ▼
      </div>
      <div
        css={css`
          width: 100%;
        `}
      >
        <Label>Output</Label>
        <FlexRow
          css={css`
            align-items: center;
            gap: 8px;
          `}
        >
          <Input
            css={css`
              width: 218px;
            `}
            value={outputAmount}
            type="number"
            disabled
          />
          <p>
            {direction === BUY
              ? baseCoinInfo.data?.symbol
              : quoteCoinInfo.data?.symbol}
          </p>
        </FlexRow>
      </div>
      <Button
        css={css`
          width: 100%;
        `}
        onClick={async () => {
          if (!executionPrice) return;
          const sizeDecimals =
            direction === BUY
              ? parseFloat(outputAmount)
              : parseFloat(inputAmount);
          const size = u64(
            Math.floor(
              (sizeDecimals * 10 ** baseCoinInfo.data.decimals) /
                market.lotSize,
            ),
          );
          const price = u64(
            fromDecimalPrice({
              price: executionPrice,
              lotSize: market.lotSize,
              tickSize: market.tickSize,
              baseCoinDecimals: baseCoinInfo.data.decimals,
              quoteCoinDecimals: quoteCoinInfo.data.decimals,
            }),
          );
          // AKA total number of ticks transacted
          const quote = calculate_max_quote_match_(
            direction,
            u64(incentiveParams.data.takerFeeDivisor),
            size.mul(price),
            undefined!,
          );

          await placeSwap(
            u64(market.marketId),
            direction,
            size, // min_base
            MAX_POSSIBLE, // max_base
            quote, // min_quote
            MAX_POSSIBLE, // max_quote
            price,
            market.baseType,
            market.quoteType,
          );
        }}
        variant="primary"
        size="sm"
        disabled={!!disabledReason}
      >
        {disabledReason ? disabledReason : "SWAP"}
      </Button>
    </>
  );
};

const SwapContainer = styled(FlexCol)`
  border: 1px solid ${({ theme }) => theme.colors.grey[700]};
  padding: 16px 32px;
  width: fit-content;
  align-items: center;
  label {
    margin-top: 16px;
    margin-bottom: 4px;
  }
  input {
    margin-bottom: 16px;
  }
`;
