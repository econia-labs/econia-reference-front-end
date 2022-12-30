import { u64 } from "@manahippo/move-to-ts";

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ConnectWalletButton } from "../../hooks/ConnectWalletButton";
import { useAptos } from "../../hooks/useAptos";
import { useCoinStore } from "../../hooks/useCoinStore";
import { useMarketAccount } from "../../hooks/useMarketAccount";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { useWithdrawFromMarketAccount } from "../../hooks/useWithdrawFromMarketAccount";
import { toDecimalCoin } from "../../utils/units";

export const UserInfo: React.FC<{
  className?: string;
  market?: RegisteredMarket;
}> = ({ className, market }) => {
  return (
    <UserInfoContainer
      className={className}
      css={css`
        height: 160px;
        width: 360px;
      `}
    >
      <h3>User info</h3>
      {market ? <UserInfoInner market={market} /> : <div>Loading...</div>}
    </UserInfoContainer>
  );
};

const UserInfoInner: React.FC<{ market: RegisteredMarket }> = ({ market }) => {
  const { account, connected } = useAptos();
  const baseCoinStore = useCoinStore(market.baseType, account?.address);
  const quoteCoinStore = useCoinStore(market.quoteType, account?.address);
  const marketAccount = useMarketAccount(market.marketId, account?.address);
  const withdrawFromMarketAccount = useWithdrawFromMarketAccount();

  return (
    <>
      {connected ? (
        baseCoinStore.data && quoteCoinStore.data && marketAccount.data ? (
          <table
            css={css`
              td {
                vertical-align: top;
                padding-bottom: 8px;
              }
              width: 100%;
            `}
          >
            <tbody>
              <tr>
                <LabelTD>Wallet bal.</LabelTD>
                <ValueTD>
                  <div>{baseCoinStore.data.balance.toString()}</div>
                  <div>{quoteCoinStore.data.balance.toString()}</div>
                </ValueTD>
                <SymbolTD>
                  <div>{baseCoinStore.data.symbol}</div>
                  <div>{quoteCoinStore.data.symbol}</div>
                </SymbolTD>
              </tr>
              <tr>
                <LabelTD>
                  <div>Unused market bal.</div>
                  {(marketAccount.data.baseAvailable.gt(0) ||
                    marketAccount.data.quoteAvailable.gt(0)) && (
                    <div
                      css={(theme) => css`
                        color: ${theme.colors.purple.primary};
                        :hover {
                          text-decoration: underline;
                          cursor: pointer;
                        }
                      `}
                      onClick={async () => {
                        if (!marketAccount.data) return;
                        await withdrawFromMarketAccount(
                          u64(market.marketId),
                          u64(marketAccount.data.baseAvailable.toString()),
                          market.baseType,
                        );
                        await withdrawFromMarketAccount(
                          u64(market.marketId),
                          u64(marketAccount.data.quoteAvailable.toString()),
                          market.quoteType,
                        );
                      }}
                    >
                      Withdraw All
                    </div>
                  )}
                </LabelTD>
                <ValueTD>
                  <div>
                    {toDecimalCoin({
                      amount: marketAccount.data.baseAvailable,
                      decimals: baseCoinStore.data.decimals,
                    }).toString()}
                  </div>
                  <div>
                    {toDecimalCoin({
                      amount: marketAccount.data.quoteAvailable,
                      decimals: quoteCoinStore.data.decimals,
                    }).toString()}
                  </div>
                </ValueTD>
                <SymbolTD>
                  <div>{baseCoinStore.data.symbol}</div>
                  <div>{quoteCoinStore.data.symbol}</div>
                </SymbolTD>
              </tr>
              <tr>
                <LabelTD>Total market bal.</LabelTD>
                <ValueTD>
                  <div>
                    {toDecimalCoin({
                      amount: marketAccount.data.baseTotal,
                      decimals: baseCoinStore.data.decimals,
                    }).toString()}
                  </div>
                  <div>
                    {toDecimalCoin({
                      amount: marketAccount.data.quoteTotal,
                      decimals: quoteCoinStore.data.decimals,
                    }).toString()}
                  </div>
                </ValueTD>
                <SymbolTD>
                  <div>{baseCoinStore.data.symbol}</div>
                  <div>{quoteCoinStore.data.symbol}</div>
                </SymbolTD>
              </tr>
            </tbody>
          </table>
        ) : (
          <div>Loading...</div>
        )
      ) : (
        <div>
          <p
            css={css`
              margin: 8px 16px;
            `}
          >
            Connect your Aptos wallet to view your balances.
          </p>
          <ConnectWalletButton
            css={css`
              margin-bottom: 16px;
            `}
            size="sm"
            variant="primary"
          />
        </div>
      )}
    </>
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
  font-weight: semi-bold;
  text-align: left;
`;

const ValueTD = styled.td`
  text-align: right;
`;

const SymbolTD = styled.td`
  text-align: left;
  color: ${({ theme }) => theme.colors.grey[500]};
`;
