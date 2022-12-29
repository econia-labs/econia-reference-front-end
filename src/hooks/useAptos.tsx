import { AccountKeys, useWallet } from "@manahippo/aptos-wallet-adapter";
import { AptosClient, FaucetClient, TxnBuilderTypes } from "aptos";
import { TransactionPayload_EntryFunctionPayload } from "aptos/src/generated";

import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
} from "react";
import Modal from "react-modal";
import { useQueryClient } from "react-query";

import { css, useTheme } from "@emotion/react";

import { Button } from "../components/Button";
import { FlexCol } from "../components/FlexCol";

interface IAptosContext {
  connect: () => void;
  aptosClient: AptosClient;
  account: AccountKeys | null;
  createTxLink: (txId: string | number) => string;
  sendTx: (
    payload:
      | TxnBuilderTypes.TransactionPayloadEntryFunction
      | TransactionPayload_EntryFunctionPayload,
  ) => Promise<void>;
}

export const AptosContext = createContext<IAptosContext | undefined>(undefined);
// TODO: Dynamic by network
const aptosClient = new AptosClient("https://fullnode.testnet.aptoslabs.com");

export const AptosContextProvider: React.FC<PropsWithChildren> = (props) => {
  const {
    connect: connectToWallet,
    wallets,
    signAndSubmitTransaction,
    account,
  } = useWallet();
  const [showConnectModal, setShowConnectModal] = React.useState(false);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const sendTx = useCallback(
    async (payload: TransactionPayload_EntryFunctionPayload) => {
      const tx = await signAndSubmitTransaction(payload);
      console.log("tx", tx);
      queryClient.invalidateQueries();
    },
    [signAndSubmitTransaction],
  );

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
        value={{
          connect: () => setShowConnectModal(true),
          aptosClient,
          account,
          createTxLink: (txId) => {
            // TODO: Dynamic by network
            return `https://explorer.aptoslabs.com/txn/${txId}?network=testnet`;
          },
          sendTx,
        }}
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
