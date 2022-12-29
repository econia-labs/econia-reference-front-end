import React from "react";
import { Line } from "react-chartjs-2";

import { useTheme } from "@emotion/react";

import { CoinInfo } from "../../../hooks/useCoinInfo";
import { RegisteredMarket } from "../../../hooks/useRegisteredMarkets";
import { useTakerEvents } from "../../../hooks/useTakerEvents";
import { toDecimalPrice } from "../../../utils/units";

enum PriceStatus {
  NEUTRAL,
  POSITIVE,
  NEGATIVE,
}

export const PriceChart: React.FC<{
  market: RegisteredMarket;
  baseCoinInfo: CoinInfo;
  quoteCoinInfo: CoinInfo;
}> = ({ market, baseCoinInfo, quoteCoinInfo }) => {
  const theme = useTheme();
  const takerEvents = useTakerEvents(market.marketId);
  const labels = [];
  const data: number[] = [];
  if (takerEvents.data) {
    for (const event of takerEvents.data) {
      labels.push(event.version);
      data.push(
        toDecimalPrice({
          price: event.price,
          lotSize: market.lotSize,
          tickSize: market.tickSize,
          baseCoinDecimals: baseCoinInfo.decimals,
          quoteCoinDecimals: quoteCoinInfo.decimals,
        }).toNumber(),
      );
    }
  }

  let priceStatus = PriceStatus.NEUTRAL;
  if (data.length > 1) {
    if (data[data.length - 1] > data[data.length - 2]) {
      priceStatus = PriceStatus.POSITIVE;
    } else if (data[data.length - 1] < data[data.length - 2]) {
      priceStatus = PriceStatus.NEGATIVE;
    }
  }

  let borderColor = theme.colors.purple.primary;
  if (priceStatus === PriceStatus.POSITIVE) {
    borderColor = theme.colors.green.primary;
  } else if (priceStatus === PriceStatus.NEGATIVE) {
    borderColor = theme.colors.red.primary;
  }

  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
      data={{
        labels,
        datasets: [
          {
            label: "Price",
            data: data,
            borderColor,
          },
        ],
      }}
    />
  );
};
