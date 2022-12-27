import { parseTypeTagOrThrow } from "@manahippo/move-to-ts";

import React from "react";
import { useState } from "react";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { useOnClickawayRef } from "../hooks/useOnClickawayRef";
import { useRegisterMarket } from "../hooks/useRegisterMarket";
import { RegisteredMarket } from "../hooks/useRegisteredMarkets";
import { DropdownMenu } from "./DropdownMenu";

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
  const [showMarketMenu, setShowMarketMenu] = useState(false);
  const marketMenuClickawayRef = useOnClickawayRef(() =>
    setShowMarketMenu(false),
  );
  const registerMarket = useRegisterMarket();

  return (
    <div ref={marketMenuClickawayRef}>
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
        {allowMarketRegistration && (
          <MarketMenuItem
            onClick={async () => {
              const baseCoin = prompt("Enter base coin address");
              const quoteCoin = prompt("Enter quote coin address");
              if (baseCoin === null) {
                alert("Base coin address is required");
                return;
              } else if (quoteCoin === null) {
                alert("Quote coin address is required");
                return;
              }
              await registerMarket(
                parseTypeTagOrThrow(baseCoin),
                parseTypeTagOrThrow(quoteCoin),
              ).catch((e) => console.error("Error registering market", e));
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
