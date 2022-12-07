import { EconiaLogo } from "assets/EconiaLogo";
import { Button } from "components/Button";
import { DefaultContainer } from "layout/DefaultContainer";
import { DefaultWrapper } from "layout/DefaultWrapper";

import React from "react";
import { Link } from "react-router-dom";

import { css } from "@emotion/react";

export const Header: React.FC = () => {
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
        <Button size="sm" variant="primary">
          Connect Wallet
        </Button>
      </DefaultContainer>
    </DefaultWrapper>
  );
};
