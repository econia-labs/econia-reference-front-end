import { WalletProvider } from "@manahippo/aptos-wallet-adapter";
import { theme } from "themes";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Global, ThemeProvider, css } from "@emotion/react";

import { App } from "./App";

const queryClient = new QueryClient();

export const AppWithProviders: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider theme={theme}>
          <Global styles={GlobalStyles} />
          <WalletProvider wallets={[]}>
            <App />
          </WalletProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

const GlobalStyles = css`
  * {
  }
  html,
  body {
    min-width: 990px;
  }
  body {
    font-family: Roboto Mono, sans-serif;
    margin: 0;

    font-size: 20px;
    font-weight: 400;
    max-width: 100%;
    min-height: 100vh;
    color: #ffffff;
    #approot {
      overflow-x: hidden;
    }
    background-color: #020202;
  }
  a {
    text-decoration: none;
    color: #ffffff;
  }
  h1 h2 h3 h4 h5 {
    font-family: Jost, sans-serif;
  }
`;
