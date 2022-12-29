import React, { useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { RadioGroup } from "../../components/RadioGroup";
import { useAptos } from "../../hooks/useAptos";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useCoinStore } from "../../hooks/useCoinStore";
import { useMarketAccount } from "../../hooks/useMarketAccount";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { toDecimalCoin } from "../../utils/units";
import { LimitOrderForm } from "./orderPlacement/LimitOrderForm";
import { MarketOrderForm } from "./orderPlacement/MarketOrderForm";

enum Mode {
  Limit = "Limit",
  Market = "Market",
}

export const TradeActions: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ className, market }) => {
  const [selectedOption, setSelectedOption] = useState(Mode.Limit);
  const { account, connected } = useAptos();
  const baseCoinStore = useCoinStore(market.baseType, account?.address);
  const quoteCoinStore = useCoinStore(market.quoteType, account?.address);
  const marketAccounts = useMarketAccount(market.marketId, account?.address);

  return (
    <DefaultContainer
      className={className}
      css={(theme) => css`
        width: fit-content;
        border-left: 1px solid ${theme.colors.grey[700]};
        border-right: 1px solid ${theme.colors.grey[700]};
        border-bottom: 1px solid ${theme.colors.grey[700]};
      `}
    >
      <UserInfoContainer>
        <h3>User info</h3>
        {connected ? (
          baseCoinStore.data && quoteCoinStore.data ? (
            <table
              css={css`
                width: 100%;
              `}
            >
              <tbody>
                <tr>
                  <td
                    css={css`
                      text-align: left;
                    `}
                  >
                    {baseCoinStore.data.symbol} bal.
                  </td>
                  <td
                    css={css`
                      text-align: right;
                    `}
                  >
                    {baseCoinStore.data.balance.toString() ?? "-"}{" "}
                  </td>
                </tr>
                <tr>
                  <td
                    css={css`
                      text-align: left;
                    `}
                  >
                    {quoteCoinStore.data.symbol} bal.
                  </td>
                  <td
                    css={css`
                      text-align: right;
                    `}
                  >
                    {quoteCoinStore.data.balance.toString() ?? "-"}{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div>Loading...</div>
          )
        ) : (
          <div>Not connected</div>
        )}
      </UserInfoContainer>
      <RadioGroup
        css={(theme) => css`
          border-bottom: 1px solid ${theme.colors.grey[700]};
          width: 360px;
        `}
        options={[Mode.Limit, Mode.Market]}
        value={selectedOption}
        onChange={(value) => setSelectedOption(value as Mode)}
      />
      <div
        css={css`
          margin-top: 32px;
        `}
      >
        {selectedOption === Mode.Limit ? (
          <LimitOrderForm market={market} />
        ) : (
          <MarketOrderForm market={market} />
        )}
      </div>
    </DefaultContainer>
  );
};

const UserInfoContainer = styled.div`
  text-align: center;
  margin-bottom: 16px;
  padding: 0px 16px;
  p {
    font-size: 14px;
  }
`;
