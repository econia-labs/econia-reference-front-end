import React from "react";

import { css } from "@emotion/react";

import { FlexCol } from "../../components/FlexCol";
import { RadioGroup } from "../../components/RadioGroup";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { DepthChart } from "./charts/DepthChart";

export const TradeChart: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ market }) => {
  const [mode, setMode] = React.useState<string>("Depth");
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);

  if (baseCoinInfo.isLoading || quoteCoinInfo.isLoading) {
    // TODO: Better loading state
    return <div>Loading...</div>;
  } else if (!baseCoinInfo.data || !quoteCoinInfo.data) {
    // TODO: Better error state
    return <div>Error loading coin info</div>;
  }

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
          <DepthChart
            market={market}
            baseCoinInfo={baseCoinInfo.data}
            quoteCoinInfo={quoteCoinInfo.data}
          />
        )}
      </div>
    </FlexCol>
  );
};
