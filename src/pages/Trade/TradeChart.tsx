import React from "react";

import { css } from "@emotion/react";

import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Loading } from "../../components/Loading";
import { RadioGroup } from "../../components/RadioGroup";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { DepthChart } from "./charts/DepthChart";
import { PriceChart } from "./charts/PriceChart";

export const TradeChart: React.FC<{
  className?: string;
  market?: RegisteredMarket;
}> = ({ className, market }) => {
  const [mode, setMode] = React.useState<string>("Depth");
  return (
    <div
      css={css`
        height: 100%;
      `}
      className={className}
    >
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
      {market ? <TradeChartInner market={market} mode={mode} /> : <Loading />}
    </div>
  );
};

const TradeChartInner: React.FC<{
  market: RegisteredMarket;
  mode: string;
}> = ({ market, mode }) => {
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);

  if (baseCoinInfo.isLoading || quoteCoinInfo.isLoading) {
    // TODO: Better loading state
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (!baseCoinInfo.data || !quoteCoinInfo.data) {
    // TODO: Better error state
    return <div>Error loading coin info</div>;
  }

  return (
    <>
      <FlexCol>
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
    </>
  );
};
