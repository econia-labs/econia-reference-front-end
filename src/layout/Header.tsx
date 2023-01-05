import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { HexString } from "aptos";

import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Theme, css } from "@emotion/react";
import styled from "@emotion/styled";

import { EconiaLogo } from "../assets/EconiaLogo";
import { Button } from "../components/Button";
import { DropdownMenu } from "../components/DropdownMenu";
import { ExternalLink } from "../components/ExternalLink";
import { FlexRow } from "../components/FlexRow";
import { useAptos } from "../hooks/useAptos";
import { useOnClickawayRef } from "../hooks/useOnClickawayRef";
import { shortenAddress } from "../utils/address";
import { DefaultContainer } from "./DefaultContainer";
import { DefaultWrapper } from "./DefaultWrapper";

const HEADER_ITEMS = [
  {
    label: "Swap",
    pathname: "/",
  },
  {
    label: "Trade",
    pathname: "/trade",
  },
  {
    label: "Faucet",
    pathname: "/faucet",
  },
];

export const Header: React.FC = () => {
  const { connected, account, disconnect } = useWallet();
  const { connect } = useAptos();
  const [showDisconnectMenu, setShowDisconnectMenu] = React.useState(false);
  const disconnectMenuClickawayRef = useOnClickawayRef(() =>
    setShowDisconnectMenu(false),
  );
  const location = useLocation();
  return (
    <DefaultWrapper
      css={(theme) => css`
        border-bottom: 1px solid ${theme.colors.grey[600]};
      `}
    >
      <DefaultContainer
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 8px 0;
        `}
      >
        <div
          css={css`
            justify-content: left;
            flex: 1;
          `}
        >
          <Link to="/">
            <EconiaLogo />
          </Link>
        </div>
        <NavContainer>
          {HEADER_ITEMS.map(({ label, pathname }, i) => (
            <Link
              key={i}
              css={
                location.pathname === pathname
                  ? ActiveNavLinkStyle
                  : NavLinkStyle
              }
              to={pathname}
            >
              {label}
            </Link>
          ))}
          <ExternalLink css={NavLinkStyle} href="https://econia.dev">
            Docs
          </ExternalLink>
        </NavContainer>
        <FlexRow
          css={css`
            flex: 1;
            justify-content: end;
          `}
        >
          {connected ? (
            <div ref={disconnectMenuClickawayRef}>
              <Button
                css={css`
                  width: 200px;
                `}
                size="sm"
                variant="outline"
                onClick={() => setShowDisconnectMenu(!showDisconnectMenu)}
              >
                {account?.address &&
                  shortenAddress(HexString.ensure(account.address))}
              </Button>
              <DropdownMenu show={showDisconnectMenu}>
                <div
                  className="menu-item"
                  css={(theme) => css`
                    text-align: center;
                    padding: 16px 0;
                    width: 200px;
                    outline: 1px solid ${theme.colors.grey[600]};
                  `}
                  onClick={() =>
                    disconnect().then(() => setShowDisconnectMenu(false))
                  }
                >
                  Disconnect
                </div>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              css={css`
                width: 200px;
              `}
              size="sm"
              variant="outline"
              onClick={() => connect()}
            >
              Connect Wallet
            </Button>
          )}
        </FlexRow>
      </DefaultContainer>
    </DefaultWrapper>
  );
};

const NavContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 24px;
`;

const NavLinkStyle = (theme: Theme) => css`
  font-size: 18px;
  line-height: 20px;
  :hover {
    color: ${theme.colors.purple.primary};
  }
`;

const ActiveNavLinkStyle = (theme: Theme) => css`
  font-size: 18px;
  line-height: 20px;
  color: ${theme.colors.purple.primary};
`;
