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
        border-bottom: 1px solid ${theme.colors.grey[700]};
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
        <EconiaLogo width={32} height={32} />
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
        {connected ? (
          <div ref={disconnectMenuClickawayRef}>
            <Button
              css={css`
                width: 200px;
              `}
              size="sm"
              variant="secondary"
              onClick={() => setShowDisconnectMenu(!showDisconnectMenu)}
            >
              {account?.address &&
                shortenAddress(HexString.ensure(account.address))}
            </Button>
            <DropdownMenu show={showDisconnectMenu}>
              <div
                css={css`
                  text-align: center;
                  padding: 16px 0;
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
            variant="primary"
            onClick={() => connect()}
          >
            Connect Wallet
          </Button>
        )}
      </DefaultContainer>
    </DefaultWrapper>
  );
};

const NavContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const ActiveNavLinkStyle = (theme: Theme) => css`
  text-decoration: underline 2px solid ${theme.colors.grey[100]};
`;

const NavLinkStyle = (theme: Theme) => css`
  :hover {
    text-decoration: underline 2px solid ${theme.colors.grey[100]};
  }
`;
