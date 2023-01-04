import { StructTag } from "@manahippo/move-to-ts";

import { useMemo, useState } from "react";

import { CoinInfo, useCoinInfos } from "./useCoinInfos";
import { RegisteredMarket } from "./useRegisteredMarkets";

export const useMarketSelectByCoin = (markets: RegisteredMarket[]) => {
  const uniqueCoinTypes = useMemo(() => {
    const seen: Record<string, boolean> = {};
    const res = [];
    for (const m of markets) {
      const baseKey = m.baseType.getFullname();
      if (!seen[baseKey]) {
        res.push(m.baseType);
        seen[baseKey] = true;
      }
      const quoteKey = m.quoteType.getFullname();
      if (!seen[quoteKey]) {
        res.push(m.quoteType);
        seen[quoteKey] = true;
      }
    }
    return res;
  }, [markets]);
  const coinInfos = useCoinInfos(uniqueCoinTypes);
  const coinTypeToInfo = useMemo(() => {
    if (!coinInfos.data) return new Map<string, CoinInfo>();
    const res = new Map<string, CoinInfo>();
    for (let i = 0; i < coinInfos.data.length; i++) {
      res.set(uniqueCoinTypes[i].getFullname(), coinInfos.data[i]);
    }
    return res;
  }, [uniqueCoinTypes, coinInfos]);
  const coinToMarkets = useMemo(() => {
    const coinToMarkets = new Map<string, RegisteredMarket[]>();
    for (const m of markets) {
      const baseKey = m.baseType.getFullname();
      if (!coinToMarkets.has(baseKey)) {
        coinToMarkets.set(baseKey, []);
      }
      const quoteKey = m.quoteType.getFullname();
      if (!coinToMarkets.has(quoteKey)) {
        coinToMarkets.set(quoteKey, []);
      }
      coinToMarkets.get(baseKey)!.push(m);
      coinToMarkets.get(quoteKey)!.push(m);
    }
    return coinToMarkets;
  }, [markets]);
  const [inputCoin, setInputCoin] = useState<StructTag>(markets[0].quoteType);
  const [outputCoin, setOutputCoin] = useState<StructTag>(markets[0].baseType);
  const allCoinInfos: CoinInfo[] = useMemo(() => {
    const res = [];
    for (const coinType of uniqueCoinTypes) {
      const coinInfo = coinTypeToInfo.get(coinType.getFullname());
      if (coinInfo) {
        res.push(coinInfo);
      }
    }
    return res;
  }, [uniqueCoinTypes, coinTypeToInfo]);
  const outputCoinInfos: CoinInfo[] = [];
  const matchingMarkets = coinToMarkets.get(inputCoin.getFullname()) ?? [];
  for (const market of matchingMarkets) {
    const mBaseCoinInfo = coinTypeToInfo.get(market.baseType.getFullname());
    const mQuoteCoinInfo = coinTypeToInfo.get(market.quoteType.getFullname());
    if (
      mQuoteCoinInfo &&
      market.baseType.getFullname() === inputCoin.getFullname()
    ) {
      outputCoinInfos.push(mQuoteCoinInfo);
    } else if (
      mBaseCoinInfo &&
      market.quoteType.getFullname() === inputCoin.getFullname()
    ) {
      outputCoinInfos.push(mBaseCoinInfo);
    }
  }
  const market = markets.find(
    (m) =>
      (m.baseType.getFullname() === inputCoin.getFullname() &&
        m.quoteType.getFullname() === outputCoin.getFullname()) ||
      (m.baseType.getFullname() === outputCoin.getFullname() &&
        m.quoteType.getFullname() === inputCoin.getFullname()),
  );

  return {
    inputCoin,
    setInputCoin: (coin: CoinInfo) => {
      // TODO: More efficient search
      for (let i = 0; i < allCoinInfos.length; i++) {
        if (allCoinInfos[i] === coin) {
          setInputCoin(uniqueCoinTypes[i]);
          return;
        }
      }
    },
    outputCoin,
    setOutputCoin: (coin: CoinInfo) => {
      // TODO: More efficient search
      for (let i = 0; i < allCoinInfos.length; i++) {
        if (allCoinInfos[i] === coin) {
          setOutputCoin(uniqueCoinTypes[i]);
          return;
        }
      }
    },
    allCoinInfos,
    outputCoinInfos,
    market,
  };
};
