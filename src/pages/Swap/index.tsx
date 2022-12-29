import { u64 } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import React, { FormEvent, useCallback, useMemo, useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { MarketDropdown } from "../../components/MarketDropdown";
import { TxButton } from "../../components/TxButton";
import { BUY } from "../../constants";
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
import {
  fromDecimalPrice,
  fromDecimalQuote,
  fromDecimalSize,
} from "../../utils/units";

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
  const { outputAmount, executionPrice, sizeFillable, disabledReason } =
    useMemo(() => {
      if (inputAmount === "")
        return {
          outputAmount: "",
          sizeFillable: undefined,
          executionPrice: undefined,
          disabledReason: "Enter an amount",
        };
      if (!marketPrice.data || !baseCoinInfo.data || !quoteCoinInfo.data)
        return { outputAmount: "", disabledReason: "Loading..." };

      let sizeFillable: BigNumber | undefined,
        executionPrice: BigNumber | undefined;
      if (direction === BUY) {
        const quote = fromDecimalQuote({
          quote: new BigNumber(inputAmount),
          tickSize: market.tickSize,
          quoteCoinDecimals: quoteCoinInfo.data.decimals,
        });
        if (quote.gt(marketPrice.data.maxBuyQuote)) {
          return {
            outputAmount: "",
            executionPrice,
            sizeFillable,
            disabledReason: "Input exceeds liquidity",
          };
        }
        const res = marketPrice.data.getExecutionPriceQuote(quote, direction);
        ({ sizeFillable, executionPrice } = res);
      } else {
        const size = fromDecimalSize({
          size: new BigNumber(inputAmount),
          lotSize: market.lotSize,
          baseCoinDecimals: baseCoinInfo.data.decimals,
        });
        if (size.gt(marketPrice.data.maxSellSize)) {
          return {
            outputAmount: "",
            executionPrice,
            sizeFillable,
            disabledReason: "Input exceeds liquidity",
          };
        }
        const res = marketPrice.data.getExecutionPrice(size, direction);
        ({ sizeFillable, executionPrice } = res);
      }
      if (sizeFillable.eq(0)) {
        return {
          outputAmount: "",
          executionPrice,
          sizeFillable,
          disabledReason: "Input too small",
        };
      }
      return {
        outputAmount:
          direction === BUY
            ? sizeFillable.toString()
            : sizeFillable.multipliedBy(executionPrice).toString(),
        executionPrice,
        sizeFillable,
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
      <div
        css={(theme) =>
          css`
            background-color: ${theme.colors.grey[700]};
            width: 228px;
            padding: 8px;
            margin-bottom: 16px;
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
            {executionPrice && !executionPrice.isNaN()
              ? executionPrice.toNumber()
              : "-"}{" "}
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
            {sizeFillable?.toNumber() ?? "-"} {baseCoinInfo.data.symbol}
          </p>
        </FlexRow>
      </div>

      <TxButton
        css={css`
          width: 100%;
        `}
        onClick={async () => {
          if (!executionPrice) return;
          const sizeDecimals =
            direction === BUY
              ? new BigNumber(outputAmount)
              : new BigNumber(inputAmount);
          const size = u64(
            fromDecimalSize({
              size: sizeDecimals,
              lotSize: market.lotSize,
              baseCoinDecimals: baseCoinInfo.data.decimals,
            }).toFixed(0),
          );
          const price = u64(
            fromDecimalPrice({
              price: executionPrice,
              lotSize: market.lotSize,
              tickSize: market.tickSize,
              baseCoinDecimals: baseCoinInfo.data.decimals,
              quoteCoinDecimals: quoteCoinInfo.data.decimals,
            }).toFixed(0),
          );
          // AKA total number of ticks transacted
          const quote = calculate_max_quote_match_(
            direction,
            u64(incentiveParams.data.takerFeeDivisor.toNumber()),
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
      </TxButton>
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
