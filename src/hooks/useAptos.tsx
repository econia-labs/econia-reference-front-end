import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { Button } from "components/Button";
import { FlexCol } from "components/FlexCol";

import React, { PropsWithChildren, createContext, useContext } from "react";
import Modal from "react-modal";

import { css, useTheme } from "@emotion/react";

interface IAptosContext {
  connect: () => void;
}

export const AptosContext = createContext<IAptosContext | undefined>(undefined);

export const AptosContextProvider: React.FC<PropsWithChildren> = (props) => {
  const { connect: connectToWallet, wallets } = useWallet();
  const [showConnectModal, setShowConnectModal] = React.useState(false);
  const theme = useTheme();

  return (
    <>
      <Modal
        isOpen={showConnectModal}
        onRequestClose={() => setShowConnectModal(false)}
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
                connectToWallet(wallet.adapter.name).then(() =>
                  setShowConnectModal(false),
                )
              }
              key={i}
            >
              {wallet.adapter.name}
            </Button>
          ))}
        </FlexCol>
      </Modal>
      <AptosContext.Provider
        value={{ connect: () => setShowConnectModal(true) }}
      >
        {props.children}
      </AptosContext.Provider>
    </>
  );
};

export const useAptos = () => {
  const context = useContext(AptosContext);
  if (!context) {
    throw new Error("useAptos must be used within an AptosContextProvider");
  }
  return context;
};
