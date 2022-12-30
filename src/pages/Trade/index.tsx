import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";

import { Button } from "../../components/Button";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { NewMarketModal } from "../../components/modals/NewMarketModal";
import {
  RegisteredMarket,
  useRegisteredMarkets,
} from "../../hooks/useRegisteredMarkets";
import { DefaultWrapper } from "../../layout/DefaultWrapper";
import { OrdersTable } from "./OrdersTable";
import { TradeActions } from "./TradeActions";
import { TradeChart } from "./TradeChart";
import { TradeHeader } from "./TradeHeader";
import { TradeTable } from "./TradeTable";

export const Trade: React.FC = () => {
  const registeredMarkets = useRegisteredMarkets();
  const [market, setMarket] = useState<RegisteredMarket>();
  const [showNewMarketModal, setShowNewMarketModal] = useState(false);
  useEffect(() => {
    if (registeredMarkets.data !== undefined && registeredMarkets.data) {
      setMarket(registeredMarkets.data[0]);
    }
  }, [registeredMarkets.data]);

  if (
    !registeredMarkets.isLoading &&
    registeredMarkets.data &&
    registeredMarkets.data.length === 0
  ) {
    return (
      <DefaultWrapper
        css={css`
          text-align: center;
        `}
      >
        <NewMarketModal
          showModal={showNewMarketModal}
          closeModal={() => setShowNewMarketModal(false)}
        />
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
          onClick={() => {
            setShowNewMarketModal(true);
          }}
        >
          Create a market
        </Button>
      </DefaultWrapper>
    );
  }

  return (
    <FlexCol
      css={css`
        height: 100%;
        width: 100%;
      `}
    >
      <TradeHeader
        css={css`
          height: 38.5px;
        `}
        market={market}
        setSelectedMarket={setMarket}
        markets={registeredMarkets.data}
      />
      <DefaultWrapper
        css={css`
          flex-grow: 1;
          height: 100%;
        `}
      >
        <FlexRow
          css={css`
            height: 100%;
          `}
        >
          <TradeActions
            css={css`
              width: 392px;
              height: 100%;
            `}
            market={market}
          />
          <FlexCol
            css={css`
              flex-grow: 1;
            `}
          >
            <FlexRow
              css={css`
                height: 340px;
              `}
            >
              <TradeTable
                css={css`
                  height: 100%;
                `}
                market={market}
              />
              <TradeChart
                css={css`
                  flex-grow: 1;
                `}
                market={market}
              />
            </FlexRow>
            <OrdersTable
              css={css`
                padding-left: 42px;
              `}
              market={market}
            />
          </FlexCol>
        </FlexRow>
      </DefaultWrapper>
    </FlexCol>
  );
};
