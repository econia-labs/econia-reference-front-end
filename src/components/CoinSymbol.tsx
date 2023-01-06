import React from "react";

import { css } from "@emotion/react";

export const CoinSymbol: React.FC<{ symbol: string | null | undefined }> = ({
  symbol,
}) => {
  return (
    <p
      css={css`
        display: inline;
      `}
    >
      {symbol ? symbol : "-"}
    </p>
  );
};
