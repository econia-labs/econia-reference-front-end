import { u64 } from "@manahippo/move-to-ts";

import React from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Button } from "../../components/Button";
import { FlexRow } from "../../components/FlexRow";
import { useRequestFaucet } from "../../hooks/useRequestFaucet";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { DefaultWrapper } from "../../layout/DefaultWrapper";
import { TestETHCoin } from "../../sdk/src/aptos_faucet/test_eth";
import { TestUSDCoin } from "../../sdk/src/aptos_faucet/test_usdc";

export const Faucet: React.FC = () => {
  const requestFaucet = useRequestFaucet();
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
            <Button
              onClick={async () => {
                // Give 0.1 tETH
                await requestFaucet(TestETHCoin.getTag(), u64(10000000));
              }}
              variant="primary"
              size="sm"
            >
              Get tETH
            </Button>
          </FaucetCard>
          <FaucetCard>
            <h2>tUSDC</h2>
            <Button
              onClick={async () => {
                // Give 110 tUSDC
                await requestFaucet(TestUSDCoin.getTag(), u64(110000000));
              }}
              variant="primary"
              size="sm"
            >
              Get tUSDC
            </Button>
          </FaucetCard>
        </FaucetContainer>
      </DefaultContainer>
    </DefaultWrapper>
  );
};

const FaucetContainer = styled(FlexRow)`
  border: 1px solid ${({ theme }) => theme.colors.grey[700]};
  padding: 16px 32px;
  width: fit-content;
  align-items: center;
  gap: 24px;
`;

const FaucetCard = styled.div`
  text-align: center;
  padding: 16px 0px;
  border: 1px solid ${({ theme }) => theme.colors.grey[600]};
  width: 200px;
  button {
    width: 140px;
  }
`;
