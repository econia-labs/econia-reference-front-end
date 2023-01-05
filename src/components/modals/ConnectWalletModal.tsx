import { useWallet } from "@manahippo/aptos-wallet-adapter";

import React from "react";

import { css, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

import { ArrowRightIcon } from "../../assets/ArrowRightIcon";
import { Button } from "../Button";
import { FlexCol } from "../FlexCol";
import { FlexRow } from "../FlexRow";
import { BaseModal } from "./BaseModal";

export const ConnectWalletModal: React.FC<{
  showModal: boolean;
  closeModal: () => void;
}> = ({ showModal, closeModal }) => {
  const { connect: connectToWallet, wallets } = useWallet();

  return (
    <BaseModal
      isOpen={showModal}
      onRequestClose={closeModal}
      style={{
        content: {
          width: "815px",
          height: "743px",
        },
      }}
    >
      <div
        css={css`
          text-align: center;
        `}
      >
        <h3
          css={css`
            margin-top: 52px;
          `}
        >
          Connect a Wallet
        </h3>
        <p
          css={css`
            font-weight: 300;
            margin: 14px 128px 52px 128px;
          `}
        >
          In order to use this site you must connect a wallet and allow the site
          to access your account.
        </p>
        <FlexCol
          css={css`
            align-items: center;
            margin: 0px 74px;
            button {
              text-align: left;
              margin-bottom: 16px;
            }
          `}
        >
          {wallets.map((wallet, i) => (
            <FlexRow
              css={(theme) =>
                css`
                  align-items: center;
                  background: ${theme.colors.grey[800]}
                    url(${wallet.adapter.icon});
                  background-position: 12px 12px;
                  background-repeat: no-repeat;
                  background-size: 32px 32px;
                  border: 1px solid ${theme.colors.grey[600]};
                  font-family: "Jost", sans-serif;
                  font-size: 24px;
                  font-weight: 500;
                  height: 60px;
                  margin-bottom: 16px;
                  padding-left: 64px;
                  width: 100%;
                  justify-content: space-between;
                  cursor: pointer;
                  :hover {
                    border: 1px solid ${theme.colors.purple.primary};
                    color: ${theme.colors.purple.primary};
                    .arrow {
                      border-left: 1px solid ${theme.colors.purple.primary};
                      border-top: 1px solid ${theme.colors.purple.primary};
                      background: ${theme.colors.purple.primary};
                      svg {
                        transform: rotate(-45deg);
                        transition: all 0.1s;
                      }
                    }
                  }
                `
              }
              onClick={() =>
                connectToWallet(wallet.adapter.name).then(closeModal)
              }
              key={i}
            >
              <p>{wallet.adapter.name} Wallet</p>
              <div
                css={css`
                  position: relative;
                  align-self: end;
                `}
              >
                <ArrowContainer className="arrow">
                  <ArrowRightIcon />
                </ArrowContainer>
              </div>
            </FlexRow>
          ))}
        </FlexCol>
      </div>
    </BaseModal>
  );
};

const ArrowContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-left: 1px solid ${({ theme }) => theme.colors.grey[600]};
  border-top: 1px solid ${({ theme }) => theme.colors.grey[600]};
`;
