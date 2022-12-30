import React from "react";

import { css } from "@emotion/react";

import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { RadioGroup } from "../../components/RadioGroup";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { DepthChart } from "./charts/DepthChart";
import { PriceChart } from "./charts/PriceChart";

export const TradeChart: React.FC<{
  className?: string;
  market?: RegisteredMarket;
}> = ({ className, market }) => {
  if (!market)
    return (
      <DefaultContainer className={className}>Loading...</DefaultContainer>
    );
  return <TradeChartInner className={className} market={market} />;
};

const TradeChartInner: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ className, market }) => {
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
    <div
      css={css`
        height: 100%;
      `}
      className={className}
    >
      <FlexCol>
        <FlexRow
          css={css`
            justify-content: flex-end;
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
        </FlexRow>
        <div
          css={css`
            max-width: 1000px;
            max-height: 500px;
          `}
        >
          {mode === "Price" ? (
            <PriceChart
              market={market}
              baseCoinInfo={baseCoinInfo.data}
              quoteCoinInfo={quoteCoinInfo.data}
            />
          ) : (
            <DepthChart
              market={market}
              baseCoinInfo={baseCoinInfo.data}
              quoteCoinInfo={quoteCoinInfo.data}
            />
          )}
        </div>
      </FlexCol>
    </div>
  );
};
