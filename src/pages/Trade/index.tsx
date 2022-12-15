import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";

import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import {
  RegisteredMarket,
  useRegisteredMarkets,
} from "../../hooks/useRegisteredMarkets";
import { DefaultWrapper } from "../../layout/DefaultWrapper";
import { TradeActions } from "./TradeActions";
import { TradeChart } from "./TradeChart";
import { TradeHeader } from "./TradeHeader";

export const Trade: React.FC = () => {
  const registeredMarkets = useRegisteredMarkets();
  const [market, setMarket] = useState<RegisteredMarket>();
  useEffect(() => {
    if (registeredMarkets.data !== undefined) {
      setMarket(registeredMarkets.data[0]);
    }
  }, [registeredMarkets.data]);

  if (
    registeredMarkets.isLoading ||
    market === undefined ||
    registeredMarkets.data === undefined
  ) {
    return <DefaultWrapper>Loading...</DefaultWrapper>;
  }
  const marketCoin = market.baseType;
  const quoteCoin = market.quoteType;

  return (
    <FlexCol
      css={css`
        height: 100%;
      `}
    >
      <TradeHeader
        market={market}
        setSelectedMarket={setMarket}
        markets={registeredMarkets.data}
      />
      <FlexRow
        css={css`
          flex-grow: 1;
        `}
      >
        <TradeActions market={market} />
        <TradeChart
          css={css`
            flex-grow: 1;
          `}
          market={market}
        />
      </FlexRow>
    </FlexCol>
  );
};
