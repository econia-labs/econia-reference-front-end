import { parseTypeTagOrThrow, u64 } from "@manahippo/move-to-ts";

import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";

import { Button } from "../../components/Button";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { NewMarketModal } from "../../components/modals/NewMarketModal";
import { useCancelAllOrders } from "../../hooks/useCancelAllOrders";
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
  const [showNewMarketModal, setShowNewMarketModal] = useState(false);
  useEffect(() => {
    if (registeredMarkets.data !== undefined && registeredMarkets.data) {
      setMarket(registeredMarkets.data[0]);
    }
  }, [registeredMarkets.data]);
  const cancelAllOrders = useCancelAllOrders();

  if (registeredMarkets.isLoading || registeredMarkets.data === undefined) {
    return <DefaultWrapper>Loading...</DefaultWrapper>;
  } else if (market === undefined) {
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
        align-items: center;
        justify-content: space-between;
      `}
    >
      <div
        css={css`
          width: 100%;
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
      </div>
      <span
        css={(theme) => css`
          font-size: 14px;
          padding: 8px 8px;
          cursor: pointer;
          color: ${theme.colors.red.primary};
          :hover {
            background-color: ${theme.colors.grey[600]};
          }
        `}
        onClick={async () => {
          await cancelAllOrders(u64(market.marketId));
        }}
      >
        Cancel All Orders
      </span>
    </FlexCol>
  );
};
