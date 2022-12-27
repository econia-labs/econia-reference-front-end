import React, { FormEvent, useCallback, useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Button } from "../../components/Button";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { MarketDropdown } from "../../components/MarketDropdown";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import {
  RegisteredMarket,
  useRegisteredMarkets,
} from "../../hooks/useRegisteredMarkets";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { DefaultWrapper } from "../../layout/DefaultWrapper";

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
  const [outputAmount, setOutputAmount] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<RegisteredMarket>(
    markets[0],
  );
  const [reverse, setReverse] = useState(false);
  const baseCoin = useCoinInfo(selectedMarket.baseType);
  const quoteCoin = useCoinInfo(selectedMarket.quoteType);
  const onInputChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      setInputAmount(e.currentTarget.value);
      setOutputAmount(e.currentTarget.value);
    },
    [setInputAmount],
  );

  if (baseCoin.isLoading || quoteCoin.isLoading) {
    // TODO: Better loading state
    return <DefaultWrapper>Loading...</DefaultWrapper>;
  } else if (baseCoin.error || quoteCoin.error) {
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
          setSelectedMarket={setSelectedMarket}
          dropdownLabel={`${baseCoin.data?.symbol} / ${quoteCoin.data?.symbol}`}
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
          <p>{reverse ? quoteCoin.data?.symbol : baseCoin.data?.symbol}</p>
        </FlexRow>
      </div>
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setReverse(!reverse)}
        >
          ▼
        </Button>
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
          <p>{reverse ? baseCoin.data?.symbol : quoteCoin.data?.symbol}</p>
        </FlexRow>
      </div>
    </>
  );
};

const SwapContainer = styled(FlexCol)`
  border: 1px solid ${({ theme }) => theme.colors.grey[700]};
  padding: 16px 32px;
  width: fit-content;
  align-items: center;
  div {
    margin-bottom: 16px;
  }
`;
