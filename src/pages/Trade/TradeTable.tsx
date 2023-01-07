import React, { useState } from "react";

import { css } from "@emotion/react";

import { FlexCol } from "../../components/FlexCol";
import { Loading } from "../../components/Loading";
import { RadioGroup } from "../../components/RadioGroup";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { BookTable } from "./charts/BookTable";
import { TradesTable } from "./charts/TradesTable";

enum Mode {
  Book = "Book",
  Trades = "Trades",
}

export const TradeTable: React.FC<{
  className?: string;
  market?: RegisteredMarket;
}> = ({ className, market }) => {
  const [selectedOption, setSelectedOption] = useState(Mode.Book);

  return (
    <FlexCol
      className={className}
      css={(theme) => css`
        border-left: 1px solid ${theme.colors.grey[600]};
        border-right: 1px solid ${theme.colors.grey[600]};
      `}
    >
      <RadioGroup
        css={(theme) => css`
          border-bottom: 1px solid ${theme.colors.grey[700]};
          width: 360px;
        `}
        options={[Mode.Book, Mode.Trades]}
        value={selectedOption}
        onChange={(value) => setSelectedOption(value as Mode)}
      />
      <div
        css={css`
          margin-top: 8px;
          flex-grow: 1;
          overflow-y: scroll;
        `}
      >
        {market ? (
          selectedOption === Mode.Book ? (
            <BookTable market={market} />
          ) : (
            <TradesTable market={market} />
          )
        ) : (
          <Loading />
        )}
      </div>
    </FlexCol>
  );
};
