import { parseTypeTagOrThrow } from "@manahippo/move-to-ts";

import React from "react";
import { useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useAptos } from "../hooks/useAptos";
import { useOnClickawayRef } from "../hooks/useOnClickawayRef";
import { RegisteredMarket } from "../hooks/useRegisteredMarkets";
import { DropdownMenu } from "./DropdownMenu";
import { NewMarketModal } from "./modals/NewMarketModal";

export const MarketDropdown: React.FC<{
  markets: RegisteredMarket[];
  setSelectedMarket: (market: RegisteredMarket) => void;
  dropdownLabel: string;
  allowMarketRegistration?: boolean;
}> = ({
  markets,
  setSelectedMarket,
  dropdownLabel,
  allowMarketRegistration,
}) => {
  const { account } = useAptos();
  const [showMarketMenu, setShowMarketMenu] = useState(false);
  const marketMenuClickawayRef = useOnClickawayRef(() =>
    setShowMarketMenu(false),
  );
  const [showNewMarketModal, setShowNewMarketModal] = useState(false);

  return (
    <div ref={marketMenuClickawayRef}>
      <NewMarketModal
        showModal={showNewMarketModal}
        closeModal={() => setShowNewMarketModal(false)}
      />
      <MarketSelector onClick={() => setShowMarketMenu(!showMarketMenu)}>
        {dropdownLabel}
      </MarketSelector>
      <DropdownMenu
        css={css`
          margin-top: 4px;
        `}
        show={showMarketMenu}
      >
        {markets.map((market, i) => (
          <MarketMenuItem
            onClick={() => {
              setSelectedMarket(market);
              setShowMarketMenu(false);
            }}
            key={i}
          >
            {market.baseType.name}-{market.quoteType.name}
          </MarketMenuItem>
        ))}
        {account !== null && allowMarketRegistration && (
          <MarketMenuItem
            onClick={() => {
              setShowNewMarketModal(true);
              setShowMarketMenu(false);
            }}
          >
            New market
          </MarketMenuItem>
        )}
      </DropdownMenu>
    </div>
  );
};

const MarketSelector = styled.span`
  color: ${({ theme }) => theme.colors.grey[600]};
  padding: 4px 8px;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.colors.grey[700]};
  }
`;

const MarketMenuItem = styled.div`
  background-color: ${({ theme }) => theme.colors.grey[800]};
  padding: 8px;
`;
