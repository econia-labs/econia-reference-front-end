import { RawCoinInfo } from "@manahippo/coin-list";

import React, { useMemo, useState } from "react";
import Modal from "react-modal";

import { css, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

import { useAptos } from "../../hooks/useAptos";
import { CoinInfo } from "../../hooks/useCoinInfos";
import { useCoinStore } from "../../hooks/useCoinStore";
import { Button } from "../Button";
import { FlexCol } from "../FlexCol";
import { FlexRow } from "../FlexRow";
import { Input } from "../Input";
import { SearchInput } from "../SearchInput";

// Precondition: coins is not empty
export const CoinSelectModal: React.FC<{
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
      <FlexCol
        css={css`
          align-items: center;
        `}
      >
        <h4
          css={css`
            margin-top: 52px;
            margin-bottom: 42px;
          `}
        >
          Select a coin
        </h4>
        <SearchInput
          css={css`
            width: 512px;
            margin-bottom: 48px;
          `}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <FlexCol
          css={css`
            align-items: center;
            margin: 0px 95px;
            width: 512px;
            button {
              text-align: left;
              margin-bottom: 16px;
            }
          `}
        >
          {filteredCoins.map((coin, i) => (
            <CoinRow
              coin={coin}
              key={i}
              onClick={() => {
                onCoinSelected(coin);
                closeModal();
              }}
            />
          ))}
        </FlexCol>
      </FlexCol>
    </Modal>
  );
};

const CoinRow: React.FC<{ coin: CoinInfo; onClick: () => void }> = ({
  coin,
  onClick,
}) => {
  const { coinListClient, account } = useAptos();
  const hippoCoinInfo = coinListClient.getCoinInfoByFullName(
    coin.typeTag.getFullname(),
  );
  const balance = useCoinStore(coin.typeTag, account?.address);
  return (
    <FlexRow
      onClick={onClick}
      css={(theme) => css`
        width: 100%;
        cursor: pointer;
        padding: 8px 16px;
        justify-content: space-between;
        align-items: center;
        :hover {
          outline: 1px solid ${theme.colors.purple.primary};
        }
      `}
    >
      <FlexRow
        css={css`
          gap: 16px;
          align-items: center;
        `}
      >
        {hippoCoinInfo ? (
          <img
            css={css`
              width: 32px;
              height: 32px;
            `}
            src={hippoCoinInfo.logo_url}
          />
        ) : (
          <div
            css={css`
              width: 32px;
              height: 32px;
            `}
          />
        )}
        <p
          css={css`
            font-size: 18px;
          `}
        >
          {coin.symbol}
        </p>
      </FlexRow>
      {balance.data && <Balance>{balance.data.balance.toString()}</Balance>}
    </FlexRow>
  );
};

const Balance = styled.p`
  color: ${({ theme }) => theme.colors.grey[600]};
  font-size: 16px;
`;
