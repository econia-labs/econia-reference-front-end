import { StructTag } from "@manahippo/move-to-ts";

import React, { useMemo, useState } from "react";
import Modal from "react-modal";

import { css, useTheme } from "@emotion/react";

import { CoinInfo } from "../../hooks/useCoinInfos";
import { useCoinInfos } from "../../hooks/useCoinInfos";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { Button } from "../Button";
import { FlexCol } from "../FlexCol";
import { Input } from "../Input";

// Precondition: coins is not empty
const CoinSelectModal: React.FC<{
  showModal: boolean;
  closeModal: () => void;
  coins: CoinInfo[];
  onCoinSelected: (c: CoinInfo) => void;
}> = ({ showModal, closeModal, coins, onCoinSelected }) => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const filteredCoins = useMemo(
    () =>
      coins.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [coins, search],
  );
  return (
    <Modal
      isOpen={showModal}
      onRequestClose={closeModal}
      style={{
        content: {
          width: "800px",
          height: "620px",
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
          Select a token
        </h1>
        <Input
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          type="text"
        />
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
          {filteredCoins.map((coin, i) => (
            <Button
              css={(theme) =>
                css`
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
              onClick={() => {
                onCoinSelected(coin);
                closeModal();
              }}
              key={i}
            >
              {coin.symbol}
            </Button>
          ))}
        </FlexCol>
      </div>
    </Modal>
  );
};

// This component contains two modals, one for selecting the input coin and one
// for selecting the output coin.  The input coin can be any coin among all the
// base and quote coins of the registered markets. The output coin is restricted
// to coins that are paired with the input coin.
export const MarketSelectByCoinModal: React.FC<{
  showInputModal: boolean;
  closeInputModal: () => void;
  showOutputModal: boolean;
  closeOutputModal: () => void;
  markets: RegisteredMarket[];
  onInputCoinSelected: (c: CoinInfo) => void;
  onOutputCoinSelected: (c: CoinInfo) => void;
}> = ({
  showInputModal,
  closeInputModal,
  showOutputModal,
  closeOutputModal,
  markets,
  onInputCoinSelected,
  onOutputCoinSelected,
}) => {
  const uniqueCoinTypes = useMemo(() => {
    const res = new Set<StructTag>();
    for (const m of markets) {
      res.add(m.baseType);
      res.add(m.quoteType);
    }
    return [...res];
  }, [markets]);
  const coinInfos = useCoinInfos(uniqueCoinTypes);
  const coinTypeToInfo = useMemo(() => {
    if (!coinInfos.data) return new Map<StructTag, CoinInfo>();
    const res = new Map<StructTag, CoinInfo>();
    for (let i = 0; i < coinInfos.data.length; i++) {
      res.set(uniqueCoinTypes[i], coinInfos.data[i]);
    }
    return res;
  }, [uniqueCoinTypes, coinInfos]);
  const coinToMarkets = useMemo(() => {
    const coinToMarkets = new Map<CoinInfo, RegisteredMarket[]>();
    for (const m of markets) {
      const baseCoinInfo = coinTypeToInfo.get(m.baseType)!;
      const quoteCoinInfo = coinTypeToInfo.get(m.quoteType)!;
      if (!coinToMarkets.has(baseCoinInfo)) {
        coinToMarkets.set(baseCoinInfo, []);
      }
      if (!coinToMarkets.has(quoteCoinInfo)) {
        coinToMarkets.set(quoteCoinInfo, []);
      }
      coinToMarkets.get(baseCoinInfo)!.push(m);
      coinToMarkets.get(quoteCoinInfo)!.push(m);
    }
    return coinToMarkets;
  }, [markets, coinTypeToInfo]);

  return (
    <>
      <CoinSelectModal
        showModal={showInputModal}
        closeModal={closeInputModal}
        coins={Array.from(coinToMarkets.keys())}
        onCoinSelected={onInputCoinSelected}
      />
      <CoinSelectModal
        showModal={showOutputModal}
        closeModal={closeOutputModal}
        coins={Array.from(coinToMarkets.keys())}
        onCoinSelected={onOutputCoinSelected}
      />
    </>
  );
};
