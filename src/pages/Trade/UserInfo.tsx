import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useAptos } from "../../hooks/useAptos";
import { useCoinStore } from "../../hooks/useCoinStore";
import { useMarketAccount } from "../../hooks/useMarketAccount";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { toDecimalCoin } from "../../utils/units";

export const UserInfo: React.FC<{ market: RegisteredMarket }> = ({
  market,
}) => {
  const { account, connected } = useAptos();
  const baseCoinStore = useCoinStore(market.baseType, account?.address);
  const quoteCoinStore = useCoinStore(market.quoteType, account?.address);
  const marketAccount = useMarketAccount(market.marketId, account?.address);
  console.log(marketAccount.data);

  return (
    <UserInfoContainer>
      <h3>User info</h3>
      {connected ? (
        baseCoinStore.data && quoteCoinStore.data && marketAccount.data ? (
          <table
            css={css`
              width: 100%;
            `}
          >
            <tbody>
              <tr>
                <LabelTD>{baseCoinStore.data.symbol} wallet bal.</LabelTD>
                <ValueTD>{baseCoinStore.data.balance.toString()}</ValueTD>
              </tr>
              <tr>
                <LabelTD>{baseCoinStore.data.symbol} market bal.</LabelTD>
                <ValueTD>
                  {toDecimalCoin({
                    amount: marketAccount.data.baseTotal,
                    decimals: baseCoinStore.data.decimals,
                  }).toString()}
                </ValueTD>
              </tr>
              <tr>
                <LabelTD>{quoteCoinStore.data.symbol} wallet bal.</LabelTD>
                <ValueTD>{quoteCoinStore.data.balance.toString()}</ValueTD>
              </tr>
              <tr>
                <LabelTD>{quoteCoinStore.data.symbol} market bal.</LabelTD>
                <ValueTD>
                  {toDecimalCoin({
                    amount: marketAccount.data.quoteTotal,
                    decimals: quoteCoinStore.data.decimals,
                  }).toString()}
                </ValueTD>
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

const LabelTD = styled.td`
  text-align: left;
`;
const ValueTD = styled.td`
  text-align: right;
`;
