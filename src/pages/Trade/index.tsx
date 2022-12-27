import { parseTypeTagOrThrow } from "@manahippo/move-to-ts";

import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";

import { Button } from "../../components/Button";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { useRegisterMarket } from "../../hooks/useRegisterMarket";
import {
  RegisteredMarket,
  useRegisteredMarkets,
} from "../../hooks/useRegisteredMarkets";
import { DefaultWrapper } from "../../layout/DefaultWrapper";
import { TradeActions } from "./TradeActions";
import { TradeChart } from "./TradeChart";
import { TradeHeader } from "./TradeHeader";
import { TradeTable } from "./TradeTable";

export const Trade: React.FC = () => {
  const registeredMarkets = useRegisteredMarkets();
  const registerMarket = useRegisterMarket();
  const [market, setMarket] = useState<RegisteredMarket>();
  useEffect(() => {
    if (registeredMarkets.data !== undefined) {
      setMarket(registeredMarkets.data[0]);
    }
  }, [registeredMarkets.data]);

  if (registeredMarkets.isLoading || registeredMarkets.data === undefined) {
    return <DefaultWrapper>Loading...</DefaultWrapper>;
  } else if (market === undefined) {
    return (
      <DefaultWrapper
        css={css`
          text-align: center;
        `}
      >
        <p
          css={css`
            margin: 16px 0px;
          `}
        >
          No markets.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={async () => {
            const baseCoin = prompt("Enter base coin address");
            const quoteCoin = prompt("Enter quote coin address");
            if (baseCoin === null) {
              alert("Base coin address is required");
              return;
            } else if (quoteCoin === null) {
              alert("Quote coin address is required");
              return;
            }
            await registerMarket(
              parseTypeTagOrThrow(baseCoin),
              parseTypeTagOrThrow(quoteCoin),
            ).catch((e) => console.error("Error registering market", e));
          }}
        >
          Create a market
        </Button>
      </DefaultWrapper>
    );
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
      <DefaultWrapper
        css={css`
          flex-grow: 1;
        `}
      >
        <FlexRow>
          <TradeActions market={market} />
          <TradeTable market={market} />
          <TradeChart
            css={css`
              flex-grow: 1;
            `}
            market={market}
          />
        </FlexRow>
      </DefaultWrapper>
    </FlexCol>
  );
};
