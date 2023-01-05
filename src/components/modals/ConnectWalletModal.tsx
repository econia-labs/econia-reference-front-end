import { useWallet } from "@manahippo/aptos-wallet-adapter";

import React from "react";

import { css, useTheme } from "@emotion/react";

import { Button } from "../Button";
import { FlexCol } from "../FlexCol";
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
            <Button
              css={(theme) =>
                css`
                  background: ${theme.colors.grey[800]}
                    url(${wallet.adapter.icon});
                  background-position: 12px 12px;
                  background-size: 32px 32px;
                  background-repeat: no-repeat;
                  padding-left: 64px;
                  width: 100%;
                  text-transform: none;
                  font-family: "Jost", sans-serif;
                `
              }
              size="sm"
              variant="outline"
              onClick={() =>
                connectToWallet(wallet.adapter.name).then(closeModal)
              }
              key={i}
            >
              {wallet.adapter.name} Wallet
            </Button>
          ))}
        </FlexCol>
      </div>
    </BaseModal>
  );
};
