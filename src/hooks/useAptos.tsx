import { AccountKeys, useWallet } from "@manahippo/aptos-wallet-adapter";
import { CoinListClient } from "@manahippo/coin-list";
import { AptosClient, TxnBuilderTypes } from "aptos";
import { TransactionPayload_EntryFunctionPayload } from "aptos/src/generated";

import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
} from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { css } from "@emotion/react";

import { TxLink } from "../components/TxLink";
import { ConnectWalletModal } from "../components/modals/ConnectWalletModal";

interface IAptosContext {
  connect: () => void;
  aptosClient: AptosClient;
  account: AccountKeys | null;
  connected: boolean;
  createTxLink: (txId: string | number) => string;
  sendTx: (
    payload:
      | TxnBuilderTypes.TransactionPayloadEntryFunction
      | TransactionPayload_EntryFunctionPayload,
  ) => Promise<void>;
  coinListClient: CoinListClient;
}

export const AptosContext = createContext<IAptosContext | undefined>(undefined);
// TODO: Dynamic by network
const aptosClient = new AptosClient("https://fullnode.testnet.aptoslabs.com");
const coinListClient = new CoinListClient("testnet");

export const AptosContextProvider: React.FC<PropsWithChildren> = (props) => {
  const { signAndSubmitTransaction, account } = useWallet();
  const [showConnectModal, setShowConnectModal] = React.useState(false);
  const queryClient = useQueryClient();

  const sendTx = useCallback(
    async (payload: TransactionPayload_EntryFunctionPayload) => {
      // TODO: Add in "waiting for signature" at this step and "sending
      // transaction" after `signAndSubmitTransaction`
      const initialToast = toast.info("Sending transaction...");
      try {
        const tx = await signAndSubmitTransaction(payload);
        await aptosClient.waitForTransaction(tx.hash);
        toast.dismiss(initialToast);
        toast.success(
          <span>
            <TxLink
              css={css`
                text-decoration: underline;
              `}
              txId={tx.hash}
            >
              TX {tx.hash.substring(0, 6)}
            </TxLink>{" "}
            success!
          </span>,
        );
      } catch (e) {
        toast.dismiss(initialToast);
        if (e.message === "The user rejected the request") {
          toast.info("Transaction cancelled.");
        } else {
          console.error(e);
          toast.error("Transaction failed. See console for details.");
        }
      }
      // Invalidate queries after 1s
      setTimeout(() => queryClient.invalidateQueries(), 1000);
    },
    [signAndSubmitTransaction],
  );

  return (
    <>
      <ConnectWalletModal
        showModal={showConnectModal}
        closeModal={() => setShowConnectModal(false)}
      />
      <AptosContext.Provider
        value={{
          connect: () => setShowConnectModal(true),
          aptosClient,
          account,
          connected: account !== null && account.publicKey !== null,
          createTxLink: (txId) => {
            // TODO: Dynamic by network
            return `https://explorer.aptoslabs.com/txn/${txId}?network=testnet`;
          },
          sendTx: sendTx as any, // TODO: No any
          coinListClient,
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
