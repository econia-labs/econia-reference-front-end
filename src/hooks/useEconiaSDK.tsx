import { App } from "sdk/src";
import { App as EconiaApp } from "sdk/src/econia";

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

import { useAptos } from "./useAptos";

export const EconiaSDKContext = createContext<EconiaApp | undefined>(undefined);

export const EconiaSDKContextProvider: React.FC<PropsWithChildren> = (
  props,
) => {
  const { aptosClient } = useAptos();
  const sdk = useMemo(() => new App(aptosClient).econia, [aptosClient]);
  return (
    <EconiaSDKContext.Provider value={sdk}>
      {props.children}
    </EconiaSDKContext.Provider>
  );
};

export const useEconiaSDK = () => {
  const context = useContext(EconiaSDKContext);
  if (!context) {
    throw new Error("useAptos must be used within an EconiaSDKContextProvider");
  }
  return context;
};
