import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { HexString } from "aptos";
import { EconiaLogo } from "assets/EconiaLogo";
import { Button } from "components/Button";
import { useAptos } from "hooks/useAptos";
import { useOnClickawayRef } from "hooks/useOnClickawayRef";
import { DefaultContainer } from "layout/DefaultContainer";
import { DefaultWrapper } from "layout/DefaultWrapper";
import { shortenAddress } from "utils/address";

import React from "react";
import { Link } from "react-router-dom";

import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const Header: React.FC = () => {
  const { connected, account, disconnect } = useWallet();
  const { connect } = useAptos();
  const [showDisconnectMenu, setShowDisconnectMenu] = React.useState(false);
  const disconnectMenuClickawayRef = useOnClickawayRef(() =>
    setShowDisconnectMenu(false),
  );
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
        <div>
          <Link to="/">Trade</Link>
        </div>
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
              <p
                onClick={() =>
                  disconnect().then(() => setShowDisconnectMenu(false))
                }
              >
                Disconnect
              </p>
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

const DropdownMenu = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
  position: absolute;
  width: 200px;
  text-align: center;
  z-index: 3;
  p {
    background-color: ${({ theme }) => theme.colors.grey[800]};
    padding: 16px 0px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey[600]};
    width: 100%;
    cursor: pointer;
    :last-of-type {
      border-bottom: none;
    }
    :hover {
      background-color: ${({ theme }) => theme.colors.grey[600]};
    }
  }
`;
