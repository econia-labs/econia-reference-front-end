import { u64 } from "@manahippo/move-to-ts";

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { TxButton } from "../../components/TxButton";
import { useAptos } from "../../hooks/useAptos";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useCoinStore } from "../../hooks/useCoinStore";
import { useRequestFaucet } from "../../hooks/useRequestFaucet";
import { DefaultWrapper } from "../../layout/DefaultWrapper";
import { TestETHCoin } from "../../sdk/src/aptos_faucet/test_eth";
import { TestUSDCoin } from "../../sdk/src/aptos_faucet/test_usdc";

export const Faucet: React.FC = () => {
  const requestFaucet = useRequestFaucet();
  const { account } = useAptos();
  const tETHCoinStore = useCoinStore(TestETHCoin.getTag(), account?.address);
  const tUSDCoinStore = useCoinStore(TestUSDCoin.getTag(), account?.address);

  return (
    <DefaultWrapper
      css={css`
        height: 100%;
      `}
    >
      <FlexCol
        css={css`
          height: 100%;
          align-items: center;
          justify-content: center;
        `}
      >
        <FaucetContainer>
          <FaucetCard>
            <h2>tETH</h2>
            <BalanceText>
              Balance:{" "}
              {tETHCoinStore.data?.balance
                ? tETHCoinStore.data.balance.toString()
                : "-"}{" "}
              tETH
            </BalanceText>
            <TxButton
              onClick={async () => {
                // Give 0.1 tETH
                await requestFaucet(TestETHCoin.getTag(), u64(10000000));
              }}
              variant="primary"
              size="sm"
            >
              Get tETH
            </TxButton>
          </FaucetCard>
          <FaucetCard>
            <h2>tUSDC</h2>
            <BalanceText>
              Balance:{" "}
              {tUSDCoinStore.data?.balance
                ? tUSDCoinStore.data.balance.toString()
                : "-"}{" "}
              tUSDC
            </BalanceText>
            <TxButton
              onClick={async () => {
                // Give 110 tUSDC
                await requestFaucet(TestUSDCoin.getTag(), u64(110000000));
              }}
              variant="primary"
              size="sm"
            >
              Get tUSDC
            </TxButton>
          </FaucetCard>
        </FaucetContainer>
      </FlexCol>
    </DefaultWrapper>
  );
};

const FaucetContainer = styled(FlexRow)`
  padding: 16px 32px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 56px;
`;

const FaucetCard = styled.div`
  text-align: center;
  padding: 36px 56px 56px 56px;
  border: 1px solid ${({ theme }) => theme.colors.grey[600]};
  flex: 1 1 0px;
  width: 0;
  max-width: 300px;
  button {
    width: 100%;
  }
`;

const BalanceText = styled.p`
  color: ${({ theme }) => theme.colors.grey[500]};
  margin-bottom: 24px;
  white-space: nowrap;
`;
