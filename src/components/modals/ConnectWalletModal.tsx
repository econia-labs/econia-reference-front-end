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
          width: "500px",
          height: "400px",
          background: theme.colors.grey[800],
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        overlay: {
          zIndex: 3,
        },
      }}
    >
      <h1>Connect a wallet</h1>
      <FlexCol
        css={css`
          align-items: center;
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
                background: ${theme.colors.grey[700]}
                  url(${wallet.adapter.icon});
                background-position: 12px 12px;
                background-size: 32px 32px;
                background-repeat: no-repeat;
                padding-left: 64px;
                width: 200px;
              `
            }
            size="sm"
            variant="secondary"
            onClick={() =>
              connectToWallet(wallet.adapter.name).then(closeModal)
            }
            key={i}
          >
            {wallet.adapter.name}
          </Button>
        ))}
      </FlexCol>
    </Modal>
  );
};
