import {
  AptosWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  WalletProvider,
} from "@manahippo/aptos-wallet-adapter";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Global, Theme, ThemeProvider, css } from "@emotion/react";

import { App } from "./App";
import { AptosContextProvider } from "./hooks/useAptos";
import { EconiaSDKContextProvider } from "./hooks/useEconiaSDK";
import { theme } from "./themes";

const queryClient = new QueryClient();

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
`;
