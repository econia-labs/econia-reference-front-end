import React, { useState } from "react";

import { css } from "@emotion/react";

import { RadioGroup } from "../../components/RadioGroup";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { BookTable } from "./charts/BookTable";
import { TradesTable } from "./charts/TradesTable";
import { LimitOrderForm } from "./orderPlacement/LimitOrderForm";
import { MarketOrderForm } from "./orderPlacement/MarketOrderForm";

enum Mode {
  Book = "Book",
  Trades = "Trades",
}

export const TradeTable: React.FC<{
  className?: string;
  market?: RegisteredMarket;
}> = ({ className, market }) => {
  const [selectedOption, setSelectedOption] = useState(Mode.Book);

  if (!market)
    return (
      <DefaultContainer className={className}>Loading...</DefaultContainer>
    );

  return (
    <DefaultContainer
      className={className}
      css={(theme) => css`
        width: fit-content;
        border-left: 1px solid ${theme.colors.grey[700]};
        border-right: 1px solid ${theme.colors.grey[700]};
        border-bottom: 1px solid ${theme.colors.grey[700]};
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
        `}
      >
        {selectedOption === Mode.Book ? (
          <BookTable
            css={css`
              height: 240px;
              overflow-y: scroll;
            `}
            market={market}
          />
        ) : (
          <TradesTable
            css={css`
              height: 240px;
              overflow-y: scroll;
            `}
            market={market}
          />
        )}
      </div>
    </DefaultContainer>
  );
};
