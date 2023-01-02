import React from "react";

import { css } from "@emotion/react";

import { CodeIcon } from "../assets/CodeIcon";
import { Button } from "./Button";
import { ExternalLink } from "./ExternalLink";
import { FlexRow } from "./FlexRow";

export const ForkProjectButton: React.FC = () => {
  return (
    <div
      css={css`
        position: fixed;
        bottom: 8px;
        right: 16px;
        font-size: 100px;
      `}
    >
      <ExternalLink href="https://github.com/econia-labs/econia-reference-front-end">
        <Button variant="secondary" size="sm">
          <FlexRow
            css={css`
              gap: 8px;
              align-items: center;
            `}
          >
            <CodeIcon width={20} height={20} /> <p>Fork me on Github</p>
          </FlexRow>
        </Button>
      </ExternalLink>
    </div>
  );
};
