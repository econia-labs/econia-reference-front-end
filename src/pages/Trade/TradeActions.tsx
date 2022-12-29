import React, { useState } from "react";

import { css } from "@emotion/react";

import { RadioGroup } from "../../components/RadioGroup";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { DefaultContainer } from "../../layout/DefaultContainer";
import { UserInfo } from "./UserInfo";
import { LimitOrderForm } from "./orderPlacement/LimitOrderForm";
import { MarketOrderForm } from "./orderPlacement/MarketOrderForm";

enum Mode {
  Limit = "Limit",
  Market = "Market",
}

export const TradeActions: React.FC<{
  className?: string;
  market: RegisteredMarket;
}> = ({ className, market }) => {
  const [selectedOption, setSelectedOption] = useState(Mode.Limit);

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
      <UserInfo market={market} />
      <RadioGroup
        css={(theme) => css`
          border-bottom: 1px solid ${theme.colors.grey[700]};
          width: 360px;
        `}
        options={[Mode.Limit, Mode.Market]}
        value={selectedOption}
        onChange={(value) => setSelectedOption(value as Mode)}
      />
      <div
        css={css`
          margin-top: 32px;
        `}
      >
        {selectedOption === Mode.Limit ? (
          <LimitOrderForm market={market} />
        ) : (
          <MarketOrderForm market={market} />
        )}
      </div>
    </DefaultContainer>
  );
};
