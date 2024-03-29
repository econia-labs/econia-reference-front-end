import { u64 } from "@manahippo/move-to-ts";

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { CoinAmount } from "../../components/CoinAmount";
import { CoinSymbol } from "../../components/CoinSymbol";
import { Loading } from "../../components/Loading";
import { ConnectWalletButton } from "../../hooks/ConnectWalletButton";
import { useAptos } from "../../hooks/useAptos";
import { useCoinInfo } from "../../hooks/useCoinInfo";
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
    <UserInfoContainer className={className}>
      <h4>User info</h4>
      {market ? (
        <UserInfoInner market={market} />
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </UserInfoContainer>
  );
};

const UserInfoInner: React.FC<{ market: RegisteredMarket }> = ({ market }) => {
  const { account, connected } = useAptos();
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  const baseCoinStore = useCoinStore(market.baseType, account?.address);
  const quoteCoinStore = useCoinStore(market.quoteType, account?.address);
  const marketAccount = useMarketAccount(market.marketId, account?.address);
  const withdrawFromMarketAccount = useWithdrawFromMarketAccount();

  return (
    <>
      {connected ? (
        baseCoinStore.data != null && quoteCoinStore.data != null ? (
          <>
            <table
              css={css`
                td {
                  vertical-align: top;
                }
                tr td:last-child {
                  width: 1%;
                }
                padding: 16px 16px 0px 16px;
                width: 100%;
              `}
            >
              <tbody>
                <tr>
                  <LabelTD>Wallet bal.</LabelTD>
                  <ValueTD>
                    <CoinAmount amount={baseCoinStore.data?.balance} />
                    <CoinAmount amount={quoteCoinStore.data?.balance} />
                  </ValueTD>
                  <SymbolTD>
                    <CoinSymbol symbol={baseCoinInfo.data?.symbol} />
                    <CoinSymbol symbol={quoteCoinInfo.data?.symbol} />
                  </SymbolTD>
                </tr>
                {marketAccount.data && (
                  <>
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
                    <tr>
                      <LabelTD>
                        <div>Unused market bal.</div>
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
                  </>
                )}
              </tbody>
            </table>
            {(marketAccount.data?.baseAvailable.gt(0) ||
              marketAccount.data?.quoteAvailable.gt(0)) && (
              <div
                css={(theme) => css`
                  margin-left: 16px;
                  text-align: left;
                  color: ${theme.colors.grey[500]};
                  font-size: 14px;
                  :hover {
                    color: ${theme.colors.purple.primary};
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
                WITHDRAW ALL
              </div>
            )}
          </>
        ) : (
          <Loading />
        )
      ) : (
        <div>
          <p
            css={css`
              margin: 8px 0px;
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
