import { RawCoinInfo } from "@manahippo/coin-list";
import { Button } from "components/Button";
import { FlexCol } from "components/FlexCol";
import { Input } from "components/Input";
import { Label } from "components/Label";
import { RadioGroup } from "components/RadioGroup";
import { DefaultContainer } from "layout/DefaultContainer";

import React, { useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

const OPTIONS = ["Limit", "Market"];

export const TradeActions: React.FC<{
  className?: string;
  marketCoin: RawCoinInfo;
  quoteCoin: RawCoinInfo;
}> = ({ className, marketCoin, quoteCoin }) => {
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0]);
  const [buy, setBuy] = useState(true);
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
            value={buy ? "Buy" : "Sell"}
            onChange={(value) =>
              value === "Buy" ? setBuy(true) : setBuy(false)
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
            <Input placeholder="0.0000" type="number" />
          </InputContainer>
          <InputContainer>
            <Label
              css={css`
                margin-bottom: 4px;
              `}
            >
              Price
            </Label>
            <Input placeholder="0.0000" type="number" />
          </InputContainer>
        </div>
        <Button
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
