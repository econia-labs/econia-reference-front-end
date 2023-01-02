import { parseTypeTagOrThrow } from "@manahippo/move-to-ts";

import React from "react";
import { useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useAptos } from "../hooks/useAptos";
import { useCoinInfo } from "../hooks/useCoinInfo";
import { useOnClickawayRef } from "../hooks/useOnClickawayRef";
import { RegisteredMarket } from "../hooks/useRegisteredMarkets";
import { DropdownMenu } from "./DropdownMenu";
import { NewMarketModal } from "./modals/NewMarketModal";

export const MarketDropdown: React.FC<{
  className?: string;
  markets: RegisteredMarket[];
  setSelectedMarket: (market: RegisteredMarket) => void;
  dropdownLabel: string;
  allowMarketRegistration?: boolean;
}> = ({
  className,
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
    <div className={className} ref={marketMenuClickawayRef}>
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
            market={market}
            key={i}
          />
        ))}
        {account !== null && allowMarketRegistration && (
          <MenuItem
            onClick={() => {
              setShowNewMarketModal(true);
              setShowMarketMenu(false);
            }}
          >
            New market
          </MenuItem>
        )}
      </DropdownMenu>
    </div>
  );
};

const MarketMenuItem: React.FC<{
  market: RegisteredMarket;
  onClick: () => void;
}> = ({ market, onClick }) => {
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  if (
    baseCoinInfo.isLoading ||
    quoteCoinInfo.isLoading ||
    !baseCoinInfo.data ||
    !quoteCoinInfo.data
  ) {
    return null;
  }
  return (
    <MenuItem onClick={onClick}>
      {baseCoinInfo.data.symbol}-{quoteCoinInfo.data.symbol}
    </MenuItem>
  );
};

const MarketSelector = styled.span`
  color: ${({ theme }) => theme.colors.grey[100]};
  padding: 4px 8px;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.colors.grey[600]};
  }
`;

const MenuItem = styled.div`
  background-color: ${({ theme }) => theme.colors.grey[800]};
  padding: 8px;
`;
