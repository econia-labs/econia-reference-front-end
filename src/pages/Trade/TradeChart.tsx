import { FlexCol } from "components/FlexCol";
import { RadioGroup } from "components/RadioGroup";
import { RegisteredMarket } from "hooks/useRegisteredMarkets";

import React from "react";

import { css } from "@emotion/react";

import { DepthChart } from "./charts/DepthChart";

export const TradeChart: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ market }) => {
  const [mode, setMode] = React.useState<string>("Depth");
  return (
    <FlexCol
      css={css`
        width: 100%;
        height: 100%;
        margin-left: 4px;
      `}
    >
      <RadioGroup
        css={css`
          margin-bottom: 16px;
        `}
        options={["Price", "Depth"]}
        value={mode}
        onChange={setMode}
      />
      <div
        css={css`
          max-width: 1000px;
          max-height: 500px;
        `}
      >
        {mode === "Price" ? (
          // <PriceChart market={market} />
          <div>Price chart TODO</div>
        ) : (
          <DepthChart market={market} />
        )}
      </div>
    </FlexCol>
  );
};
