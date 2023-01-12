import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { HexString } from "aptos";

import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Theme, css } from "@emotion/react";
import styled from "@emotion/styled";

import { ArrowRightIcon } from "../assets/ArrowRightIcon";
import { EconiaLogo } from "../assets/EconiaLogo";
import { Button } from "../components/Button";
import { DropdownMenu } from "../components/DropdownMenu";
import { ExternalLink } from "../components/ExternalLink";
import { FlexRow } from "../components/FlexRow";
import { ConnectWalletButton } from "../hooks/ConnectWalletButton";
import { useOnClickawayRef } from "../hooks/useOnClickawayRef";
import { shortenAddress } from "../utils/address";
import { DefaultContainer } from "./DefaultContainer";
import { DefaultWrapper } from "./DefaultWrapper";

const HEADER_ITEMS = [
  {
    label: "SWAP",
    pathname: "/",
  },
  {
    label: "TRADE",
    pathname: "/trade",
  },
  {
    label: "FAUCET",
    pathname: "/faucet",
  },
];

export const Header: React.FC = () => {
  const { connected, account, disconnect } = useWallet();
  const [showDisconnectMenu, setShowDisconnectMenu] = React.useState(false);
  const disconnectMenuClickawayRef = useOnClickawayRef(() =>
    setShowDisconnectMenu(false),
  );
  const location = useLocation();
  return (
    <DefaultWrapper>
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
            <React.Fragment key={i}>
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
              <p
                css={(theme) =>
                  css`
                    font-size: 20px;
                    line-height: 22px;
                    color: ${theme.colors.grey[600]};
                  `
                }
              >
                /
              </p>
            </React.Fragment>
          ))}
          <ExternalLink css={NavLinkStyle} href="https://econia.dev">
            <FlexRow
              css={css`
                gap: 4px;
              `}
            >
              <span>DOCS</span>
              <ArrowRightIcon
                css={(theme) => css`
                  margin-top: 2px;
                  transform: rotate(-45deg);
                `}
                width={8}
                height={8}
              />
            </FlexRow>
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
            <ConnectWalletButton
              css={css`
                width: 200px;
              `}
              size="sm"
              variant="primary"
            />
          )}
        </FlexRow>
      </DefaultContainer>
    </DefaultWrapper>
  );
};

const NavContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const NavLinkStyle = (theme: Theme) => css`
  font-size: 20px;
  font-weight: 500;
  line-height: 22px;
  color: ${theme.colors.grey[500]};
  transition: all 300ms;
  path {
    transition: all 300ms;
    stroke: ${theme.colors.grey[500]};
  }
  :hover {
    color: ${theme.colors.purple.primary};
    path {
      stroke: ${theme.colors.purple.primary};
    }
  }
`;

const ActiveNavLinkStyle = (theme: Theme) => css`
  font-size: 20px;
  font-weight: 500;
  line-height: 22px;
  color: ${theme.colors.grey[100]};
  transition: all 300ms;
  :hover {
    color: ${theme.colors.purple.primary};
  }
`;
