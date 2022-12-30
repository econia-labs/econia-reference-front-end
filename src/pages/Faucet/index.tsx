import { u64 } from "@manahippo/move-to-ts";

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { FlexRow } from "../../components/FlexRow";
import { TxButton } from "../../components/TxButton";
import { useAptos } from "../../hooks/useAptos";
import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useCoinStore } from "../../hooks/useCoinStore";
import { useRequestFaucet } from "../../hooks/useRequestFaucet";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { DefaultWrapper } from "../../layout/DefaultWrapper";
import { TestETHCoin } from "../../sdk/src/aptos_faucet/test_eth";
import { TestUSDCoin } from "../../sdk/src/aptos_faucet/test_usdc";
import { toDecimalCoin } from "../../utils/units";

export const Faucet: React.FC = () => {
  const requestFaucet = useRequestFaucet();
  const { account } = useAptos();
  const tETHCoinStore = useCoinStore(TestETHCoin.getTag(), account?.address);
  const tETHCoinInfo = useCoinInfo(TestETHCoin.getTag());
  const tUSDCoinStore = useCoinStore(TestUSDCoin.getTag(), account?.address);
  const tUSDCoinInfo = useCoinInfo(TestUSDCoin.getTag());

  return (
    <DefaultWrapper
      css={css`
        height: 100%;
      `}
    >
      <DefaultContainer
        css={css`
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `}
      >
        <FaucetContainer>
          <FaucetCard>
            <h2>tETH</h2>
            <p>
              Balance:{" "}
              {tETHCoinStore.data && tETHCoinInfo.data
                ? toDecimalCoin({
                    amount: tETHCoinStore.data.balance,
                    decimals: tETHCoinInfo.data.decimals,
                  }).toString()
                : "-"}{" "}
              tETH
            </p>
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
            <p>
              Balance:{" "}
              {tUSDCoinStore.data && tUSDCoinInfo.data
                ? toDecimalCoin({
                    amount: tUSDCoinStore.data.balance,
                    decimals: tUSDCoinInfo.data.decimals,
                  }).toString()
                : "-"}{" "}
              tUSDC
            </p>
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
      </DefaultContainer>
    </DefaultWrapper>
  );
};

const FaucetContainer = styled(FlexRow)`
  padding: 16px 32px;
  width: fit-content;
  align-items: center;
  gap: 24px;
`;

const FaucetCard = styled.div`
  text-align: left;
  padding: 16px 16px;
  border: 1px solid ${({ theme }) => theme.colors.grey[600]};
  width: 300px;
  height: 192px;
  p {
    margin-bottom: 16px;
  }
  button {
    width: 100%;
  }
`;
