import { StructTag, u64 } from "@manahippo/move-to-ts";
import { Button } from "components/Button";
import { FlexCol } from "components/FlexCol";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { RadioGroup } from "components/RadioGroup";
import { useCoinInfo } from "hooks/useCoinInfo";
import { usePlaceLimitOrder } from "hooks/usePlaceLimitOrder";
import { RegisteredMarket } from "hooks/useRegisteredMarkets";
import { DefaultContainer } from "layout/DefaultContainer";

import React, { useRef, useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

const OPTIONS = ["Limit", "Market"];
const ASK = true;
const BID = false;

export const TradeActions: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ className, market }) => {
  const [side, setSide] = useState(BID);
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0]);
  const amountRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const placeLimitOrder = usePlaceLimitOrder();
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);

  if (baseCoinInfo.isLoading || quoteCoinInfo.isLoading) {
    // TODO: Better loading state.
    return <div>Loading...</div>;
  } else if (!baseCoinInfo.data || !quoteCoinInfo.data) {
    // TODO: Better error state.
    return <div>Failed to load coin info.</div>;
  }

  return (
    <DefaultContainer
      className={className}
      css={(theme) => css`
        width: fit-content;
        border-left: 1px solid ${theme.colors.grey[700]};
        border-right: 1px solid ${theme.colors.grey[700]};
        border-bottom: 1px solid ${theme.colors.grey[700]};
      `}
    >
      <RadioGroup
        css={(theme) => css`
          border-bottom: 1px solid ${theme.colors.grey[700]};
          width: 360px;
        `}
        options={OPTIONS}
        value={selectedOption}
        onChange={setSelectedOption}
      />
      <FlexCol
        css={css`
          align-items: center;
          margin-top: 16px;
        `}
      >
        <div>
          <RadioGroup
            css={(theme) => css`
              border: 1px solid ${theme.colors.grey[700]};
              width: 240px;
            `}
            options={["Buy", "Sell"]}
            value={side === BID ? "Buy" : "Sell"}
            onChange={(value) =>
              value === "Buy" ? setSide(BID) : setSide(ASK)
            }
          />
          <InputContainer>
            <Label
              css={css`
                margin-bottom: 4px;
              `}
            >
              Amount
            </Label>
            <Input
              css={css`
                width: 218px;
              `}
              ref={amountRef}
              placeholder="0.0000"
              type="number"
            />
          </InputContainer>
          <InputContainer>
            <Label
              css={css`
                margin-bottom: 4px;
              `}
            >
              Price
            </Label>
            <Input
              css={css`
                width: 218px;
              `}
              ref={priceRef}
              placeholder="0.0000"
              type="number"
            />
          </InputContainer>
        </div>
        <Button
          onClick={async () => {
            if (!amountRef.current) {
              alert("Amount is required");
              return;
            } else if (!priceRef.current) {
              alert("Price is required");
              return;
            }
            // TODO: Work out the correct lot size and price
            const size = u64(
              Math.floor(
                (parseFloat(amountRef.current.value) *
                  10 ** baseCoinInfo.data.decimals) /
                  market.lotSize,
              ),
            );
            const pricePerUnit = u64(
              Math.floor(
                (parseFloat(priceRef.current.value) *
                  10 ** quoteCoinInfo.data.decimals) /
                  market.tickSize,
              ),
            );
            // TODO: This only works if the lotSize is <= 1 unit
            const lotsPerUnit = u64(10 ** baseCoinInfo.data.decimals).div(
              u64(market.lotSize),
            );
            // AKA pricePerLot
            const price = pricePerUnit.div(lotsPerUnit);
            let depositAmount;
            if (side === BID) {
              depositAmount = size.mul(price).mul(u64(market.tickSize));
            } else {
              depositAmount = size.mul(u64(market.lotSize));
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
        </Button>
      </FlexCol>
    </DefaultContainer>
  );
};

const InputContainer = styled.div`
  margin-top: 16px;
`;
