import { useWallet } from "@manahippo/aptos-wallet-adapter";

import React from "react";
import Modal from "react-modal";

import { css, useTheme } from "@emotion/react";

import { Button } from "../Button";
import { FlexCol } from "../FlexCol";

export const ConnectWalletModal: React.FC<{
  showModal: boolean;
  closeModal: () => void;
}> = ({ showModal, closeModal }) => {
  const { connect: connectToWallet, wallets } = useWallet();
  const theme = useTheme();

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={closeModal}
      style={{
        content: {
          width: "815px",
          height: "743px",
          background: theme.colors.grey[800],
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: `1px solid ${theme.colors.purple.primary}`,
          borderRadius: "0px",
        },
        overlay: {
          background: "none",
          backdropFilter: "blur(5px)",
          zIndex: 3,
        },
      }}
    >
      <div
        css={css`
          text-align: center;
        `}
      >
        <h1
          css={css`
            margin-top: 52px;
          `}
        >
          Connect a Wallet
        </h1>
        <p
          css={css`
            font-weight: 300;
            margin: 14px 128px 60px 128px;
          `}
        >
          In order to use this site you must connect a wallet and allow the site
          to access your account.
        </p>
        <FlexCol
          css={css`
            align-items: center;
            margin: 0px 95px;
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
    </Modal>
  );
};
