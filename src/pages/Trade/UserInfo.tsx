import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useAptos } from "../../hooks/useAptos";
import { useCoinStore } from "../../hooks/useCoinStore";
import { useMarketAccount } from "../../hooks/useMarketAccount";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";

export const UserInfo: React.FC<{ market: RegisteredMarket }> = ({
  market,
}) => {
  const { account, connected } = useAptos();
  const baseCoinStore = useCoinStore(market.baseType, account?.address);
  const quoteCoinStore = useCoinStore(market.quoteType, account?.address);
  const marketAccounts = useMarketAccount(market.marketId, account?.address);
  return (
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
