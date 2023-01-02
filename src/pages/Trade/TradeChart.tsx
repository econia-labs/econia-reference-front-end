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
    <FlexCol
      css={css`
        height: 100%;
        align-items: flex-end;
      `}
      className={className}
    >
      <RadioGroup
        css={css`
          margin-bottom: 16px;
        `}
        options={["Price", "Depth"]}
        value={mode}
        onChange={setMode}
      />
      {market ? <TradeChartInner market={market} mode={mode} /> : <Loading />}
    </FlexCol>
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
    return <Loading />;
  } else if (!baseCoinInfo.data || !quoteCoinInfo.data) {
    // TODO: Better error state
    return <div>Error loading coin info</div>;
  }

  return (
    <>
      <div
        css={css`
          width: 688px;
          height: 350px;
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
    </>
  );
};
