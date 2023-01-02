import {
  AptosWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  WalletProvider,
} from "@manahippo/aptos-wallet-adapter";
import BigNumber from "bignumber.js";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Global, Theme, ThemeProvider, css } from "@emotion/react";

import { App } from "./App";
import { ForkProjectButton } from "./components/ForkProjectButton";
import { AptosContextProvider } from "./hooks/useAptos";
import { EconiaSDKContextProvider } from "./hooks/useEconiaSDK";
import { theme } from "./themes";

const queryClient = new QueryClient();
BigNumber.config({
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
});

export const AppWithProviders: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider theme={theme}>
          <Global styles={GlobalStyles} />
          <WalletProvider
            wallets={[
              new AptosWalletAdapter(),
              new MartianWalletAdapter(),
              new PontemWalletAdapter(),
            ]}
            autoConnect={true}
          >
            <AptosContextProvider>
              <EconiaSDKContextProvider>
                <App />
                <ToastContainer theme="dark" />
                <ForkProjectButton />
              </EconiaSDKContextProvider>
            </AptosContextProvider>
          </WalletProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

const GlobalStyles = (theme: Theme) => css`
  * {
  }
  html,
  body {
    min-width: 990px;
  }
  body {
    font-family: Roboto Mono, sans-serif;
    margin: 0;

    font-size: 16px;
    font-weight: 400;
    max-width: 100%;
    min-height: 100vh;
    color: #ffffff;
    #approot {
      overflow-x: hidden;
    }
    background-color: ${theme.colors.grey[800]};
  }
  a {
    text-decoration: none;
    color: #ffffff;
  }
  h1 h2 h3 h4 h5 {
    font-family: Jost, sans-serif;
  }
  p {
    margin: 0;
  }

  // Hide arrows
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  // react-toastify
  :root {
    --toastify-color: ${theme.colors.grey[800]};
    --toastify-color-info: ${theme.colors.blue.primary};
    --toastify-color-success: ${theme.colors.green.primary};
    --toastify-color-error: ${theme.colors.red.primary};
    --toastify-color-warning: ${theme.colors.yellow.primary};

    --toastify-icon-color-info: ${theme.colors.blue.primary};
    --toastify-icon-color-success: ${theme.colors.green.primary};
    --toastify-icon-color-error: ${theme.colors.red.primary};
    --toastify-icon-color-warning: ${theme.colors.yellow.primary};

    --toastify-font-family: Roboto Mono, sans-serif;
  }
`;
