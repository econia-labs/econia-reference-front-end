import { StructTag } from "@manahippo/move-to-ts";
import { FlexCol } from "components/FlexCol";
import { RadioGroup } from "components/RadioGroup";
import { useOrderBook } from "hooks/useOrderBook";
import { RegisteredMarket } from "hooks/useRegisteredMarkets";
import { ColorType, CrosshairMode, createChart } from "lightweight-charts";

import React, { useEffect, useRef } from "react";

import { css, useTheme } from "@emotion/react";

import { MOCK_DATA } from "./mockData";

export const TradeChart: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ className, market }) => {
  const orderBook = useOrderBook(market.marketId);
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  useEffect(() => {
    if (ref.current === null) return;
    const handleResize = () => {
      if (ref.current === null) return;
      chart.applyOptions({ width: ref.current.clientWidth });
    };

    const chart = createChart(ref.current, {
      layout: {
        background: { type: ColorType.Solid, color: theme.colors.grey[700] },
        textColor: theme.colors.grey[100],
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
      },
      grid: {
        vertLines: {
          color: theme.colors.grey[600],
        },
        horzLines: {
          color: theme.colors.grey[600],
        },
      },
      width: ref.current.clientWidth,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({
      upColor: theme.colors.green.primary,
      downColor: theme.colors.red.primary,
      borderVisible: false,
      wickUpColor: theme.colors.green.primary,
      wickDownColor: theme.colors.red.primary,
    });
    newSeries.setData(MOCK_DATA);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [theme, ref.current]);

  const [mode, setMode] = React.useState<string>("Price");
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
          width: 100%;
          height: 100%;
        `}
        ref={ref}
      />
    </FlexCol>
  );
};
