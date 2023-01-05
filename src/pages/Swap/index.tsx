import { u64 } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import React, { FormEvent, useCallback, useMemo, useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ChevronDownIcon } from "../../assets/ChevronDownIcon";
import { SyncIcon } from "../../assets/SyncIcon";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Input } from "../../components/Input";
import { Loading } from "../../components/Loading";
import { TxButton } from "../../components/TxButton";
import { CoinSelectModal } from "../../components/modals/CoinSelectModal";
import { BUY, ZERO_U64 } from "../../constants";
import { useAptos } from "../../hooks/useAptos";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useCoinStore } from "../../hooks/useCoinStore";
import { useIncentiveParams } from "../../hooks/useIncentiveParams";
import { useMarketPrice } from "../../hooks/useMarketPrice";
import { useMarketSelectByCoin } from "../../hooks/useMarketSelectByCoin";
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
        overflow-y: hidden;
      `}
    >
      <DefaultContainer
        css={css`
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          margin-top: 48px;
        `}
      >
        <div
          css={(theme) => css`
            max-width: 600px;
            margin-bottom: 48px;
            border: 1px solid ${theme.colors.grey[600]};
            padding: 8px 16px;
          `}
        >
          This is a testnet interface. All coins are used for testing purposes
          and have no real value. If you are connecting a wallet, make sure it
          is connected to Aptos testnet.
        </div>
        <SwapContainer>
          {registeredMarkets.data && registeredMarkets.data.length > 0 ? (
            <SwapInner markets={registeredMarkets.data} />
          ) : (
            <Loading />
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
  const [direction, setDirection] = useState(BUY);
  const { setInputCoin, setOutputCoin, allCoinInfos, outputCoinInfos, market } =
    useMarketSelectByCoin(markets);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showOutputModal, setShowOutputModal] = useState(false);
  const baseCoinInfo = useCoinInfo(market?.baseType);
  const quoteCoinInfo = useCoinInfo(market?.quoteType);
  const marketPrice = useMarketPrice(market);
  const incentiveParams = useIncentiveParams();
  const placeSwap = usePlaceSwap();
  const { account } = useAptos();
  const inputCoinStore = useCoinStore(
    market
      ? direction === BUY
        ? market.quoteType
        : market.baseType
      : undefined,
    account?.address,
  );
  const inputCoinInfo = direction === BUY ? quoteCoinInfo : baseCoinInfo;
  const onInputChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      setInputAmount(e.currentTarget.value);
    },
    [setInputAmount],
  );
  const { outputAmount, executionPrice, sizeFillable, disabledReason } =
    useMemo(() => {
      if (
        !market ||
        marketPrice.data === undefined ||
        !baseCoinInfo.data ||
        !quoteCoinInfo.data ||
        !inputCoinInfo.data
      )
        return { outputAmount: "", disabledReason: "Loading..." };
      else if (marketPrice.data === null) {
        return { outputAmount: "", disabledReason: "Insufficient liquidity" };
      }

      if (inputAmount === "")
        return {
          outputAmount: "",
          sizeFillable: undefined,
          executionPrice: undefined,
          disabledReason: "Enter an amount",
        };

      let sizeFillable: BigNumber | undefined,
        executionPrice: BigNumber | undefined;
      if (direction === BUY) {
        const quote = fromDecimalQuote({
          quote: new BigNumber(inputAmount),
          tickSize: market.tickSize,
          quoteCoinDecimals: quoteCoinInfo.data.decimals,
        });
        if (marketPrice.data.maxBuyQuote.eq(0)) {
          return {
            outputAmount: "",
            executionPrice,
            sizeFillable,
            disabledReason: "Market has no liquidity",
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
        if (marketPrice.data.maxSellSize.eq(0)) {
          return {
            outputAmount: "",
            executionPrice,
            sizeFillable,
            disabledReason: "Market has no liquidity",
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
      const outputAmount =
        direction === BUY
          ? sizeFillable.toString()
          : sizeFillable.multipliedBy(executionPrice).toString();
      if (inputCoinStore.data) {
        const balance = inputCoinStore.data.balance;
        if (balance.lt(inputAmount)) {
          return {
            outputAmount,
            sizeFillable,
            executionPrice,
            disabledReason: "Insufficient balance",
          };
        }
      }
      return {
        outputAmount,
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
    !incentiveParams.data
  ) {
    // TODO: Better loading state
    return <Loading />;
  } else if (!baseCoinInfo.data || !quoteCoinInfo.data) {
    // TODO: Better error state
    return <DefaultWrapper>Error loading coin info</DefaultWrapper>;
  }

  return (
    <>
      <FormContainer>
        <InputContainer>
          <InputSymbolContainer>
            <Input
              css={css`
                width: 100%;
              `}
              placeholder="0.0000"
              value={inputAmount}
              onChange={onInputChange}
              type="number"
            />
            <Symbol onClick={() => setShowInputModal(true)}>
              <p>
                {direction === BUY
                  ? quoteCoinInfo.data?.symbol
                  : baseCoinInfo.data?.symbol}
              </p>
              <ChevronDownIcon />
            </Symbol>
          </InputSymbolContainer>
        </InputContainer>
        <div
          css={(theme) => css`
            padding: 8px 16px;
            margin-bottom: 8px;
            cursor: pointer;
            :hover {
              path {
                fill: ${theme.colors.purple.primary};
              }
            }
          `}
          onClick={() => setDirection(!direction)}
        >
          <SyncIcon />
        </div>
        <InputContainer>
          <InputSymbolContainer>
            <Input
              css={css`
                width: 100%;
              `}
              placeholder="0.0000"
              value={outputAmount}
              type="number"
              disabled
            />
            <Symbol onClick={() => setShowOutputModal(true)}>
              <p>
                {direction === BUY
                  ? baseCoinInfo.data?.symbol
                  : quoteCoinInfo.data?.symbol}
              </p>
              <ChevronDownIcon />
            </Symbol>
          </InputSymbolContainer>
        </InputContainer>
      </FormContainer>
      <SwapDetailsContainer>
        <FlexRow
          css={css`
            justify-content: space-between;
            align-items: center;
          `}
        >
          <p>Balance</p>
          <p>
            {inputCoinStore.data?.balance
              ? inputCoinStore.data?.balance.toFixed(4)
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
          <p>Est. Price</p>
          <p>
            {executionPrice && !executionPrice.isNaN()
              ? executionPrice.toFixed(4)
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
          <p>Est. Fill</p>
          <p>
            {sizeFillable?.toNumber() ?? "-"} {baseCoinInfo.data.symbol}
          </p>
        </FlexRow>
      </SwapDetailsContainer>

      <TxButton
        css={css`
          width: 100%;
        `}
        onClick={async () => {
          if (
            !market ||
            !sizeFillable ||
            !executionPrice ||
            !baseCoinInfo.data ||
            !quoteCoinInfo.data
          )
            return;
          const size = u64(
            fromDecimalSize({
              size: sizeFillable,
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

          await placeSwap(
            u64(market.marketId),
            direction,
            size, // min_base
            size, // max_base // TODO: should be `size`
            ZERO_U64, // min_quote
            MAX_POSSIBLE, // max_quote
            price,
            market.baseType,
            market.quoteType,
          );
        }}
        variant="outline"
        size="sm"
        disabled={!!disabledReason}
      >
        {disabledReason ? disabledReason : "SWAP"}
      </TxButton>
      <CoinSelectModal
        showModal={showInputModal}
        closeModal={() => setShowInputModal(false)}
        coins={allCoinInfos}
        onCoinSelected={(c) => setInputCoin(c)}
      />
      <CoinSelectModal
        showModal={showOutputModal}
        closeModal={() => setShowOutputModal(false)}
        coins={outputCoinInfos}
        onCoinSelected={(c) => setOutputCoin(c)}
      />
    </>
  );
};

const SwapContainer = styled(FlexCol)`
  border: 1px solid ${({ theme }) => theme.colors.purple.primary};
  padding: 50px;
`;

const FormContainer = styled(FlexCol)`
  width: 100%;
  align-items: center;
  gap: 20px;
  margin-bottom: 36px;
`;

const InputContainer = styled.div`
  width: 368px;
`;

const InputSymbolContainer = styled(FlexRow)`
  position: relative;
  width: 100%;
  align-items: baseline;
  gap: 8px;
`;

const Symbol = styled(FlexRow)`
  position: absolute;
  bottom: 12px;
  right: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.grey[600]};
  align-items: center;
  gap: 8px;
  font-weight: 300;
  font-size: 12px;
  :hover {
    border: 1px solid ${({ theme }) => theme.colors.purple.primary};
    path {
      stroke: ${({ theme }) => theme.colors.purple.primary};
    }
  }
`;

const SwapDetailsContainer = styled(FlexCol)`
  width: 100%;
  font-size: 12px;
  font-weight: 300;
  gap: 8px;
  margin-bottom: 45px;
`;
