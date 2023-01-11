import { parseTypeTagOrThrow, u64 } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { css, useTheme } from "@emotion/react";

import { useCoinInfo } from "../../hooks/useCoinInfo";
import { useIsRecognizedMarket } from "../../hooks/useIsRecognizedMarket";
import { useRegisterMarket } from "../../hooks/useRegisterMarket";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { toDecimalQuote, toDecimalSize } from "../../utils/units";
import { Button } from "../Button";
import { ExternalLink } from "../ExternalLink";
import { FlexCol } from "../FlexCol";
import { FlexRow } from "../FlexRow";
import { Input } from "../Input";
import { Label } from "../Label";
import { SearchInput } from "../SearchInput";
import { BaseModal } from "./BaseModal";

export const MarketWizardModal: React.FC<{
  showModal: boolean;
  closeModal: () => void;
  markets: RegisteredMarket[];
  setMarket: (market: RegisteredMarket) => void;
}> = ({ showModal, closeModal, markets, setMarket }) => {
  return (
    <BaseModal isOpen={showModal} onRequestClose={closeModal}>
      <SelectMarketView
        markets={markets}
        setMarket={(market) => {
          console.log("HERE");
          setMarket(market);
          closeModal();
        }}
      />
      {/* <RegisterMarketView /> */}
    </BaseModal>
  );
};

const SelectMarketView: React.FC<{
  markets: RegisteredMarket[];
  setMarket: (market: RegisteredMarket) => void;
}> = ({ markets, setMarket }) => {
  const [search, setSearch] = useState("");
  const filteredMarkets = useMemo(
    () =>
      markets.filter((c) => {
        const name = `${c.baseType.getFullname().toLowerCase()}-${c.quoteType
          .getFullname()
          .toLowerCase()}`;
        return name.includes(search.toLowerCase());
      }),
    [markets, search],
  );
  return (
    <>
      <h4
        css={css`
          margin-top: 52px;
        `}
      >
        Select a market
      </h4>
      <SearchInput
        css={css`
          width: 100%;
          margin: 16px 0px;
        `}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <FlexCol
        css={css`
          margin-bottom: 52px;
          label {
            margin-bottom: 4px;
          }
          input {
            margin-bottom: 16px;
          }
        `}
      >
        {filteredMarkets.map((market, i) => (
          <MarketMenuItem
            onClick={() => {
              setMarket(market);
            }}
            market={market}
            key={i}
          />
        ))}
      </FlexCol>
    </>
  );
};

const MarketMenuItem: React.FC<{
  market: RegisteredMarket;
  onClick: () => void;
}> = ({ market, onClick }) => {
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  useIsRecognizedMarket(market);
  if (
    baseCoinInfo.isLoading ||
    quoteCoinInfo.isLoading ||
    !baseCoinInfo.data ||
    !quoteCoinInfo.data
  ) {
    return null;
  }
  const lotSize = toDecimalSize({
    size: new BigNumber(1),
    lotSize: market.lotSize,
    baseCoinDecimals: baseCoinInfo.data.decimals,
  });
  const tickSize = toDecimalQuote({
    ticks: new BigNumber(1),
    tickSize: market.tickSize,
    quoteCoinDecimals: quoteCoinInfo.data.decimals,
  });
  const minSize = lotSize.multipliedBy(market.minSize);
  return (
    <FlexRow
      onClick={onClick}
      css={(theme) => css`
        cursor: pointer;
        padding: 8px 16px;
        justify-content: space-between;
        align-items: center;
        :hover {
          outline: 1px solid ${theme.colors.purple.primary};
        }
      `}
    >
      <p>
        {baseCoinInfo.data.symbol}-{quoteCoinInfo.data.symbol}
      </p>
      <p>
        {lotSize.toNumber()}-{tickSize.toNumber()}-{minSize.toNumber()}-
        {market.isRecognized ? "✅" : "❌"}
      </p>
    </FlexRow>
  );
};

const RegisterMarketView: React.FC = () => {
  const registerMarket = useRegisterMarket();
  const baseCoinRef = React.useRef<HTMLInputElement>(null);
  const quoteCoinRef = React.useRef<HTMLInputElement>(null);
  const lotSizeRef = React.useRef<HTMLInputElement>(null);
  const tickSizeRef = React.useRef<HTMLInputElement>(null);
  const minSizeRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <h4
        css={css`
          margin-top: 52px;
        `}
      >
        Register Market
      </h4>
      <p
        css={css`
          font-size: 14px;
          margin-bottom: 16px;
        `}
      >
        Register a new market with the Econia protocol.{" "}
        <ExternalLink
          css={css`
            text-decoration: underline;
          `}
          href="https://econia.dev/overview/orders"
        >
          See the docs
        </ExternalLink>{" "}
        for parameterization tips.
      </p>
      <FlexCol
        css={css`
          label {
            margin-bottom: 4px;
          }
          input {
            margin-bottom: 16px;
          }
        `}
      >
        <Label>Base adddress</Label>
        <Input ref={baseCoinRef} placeholder="0x1::aptos_coin::AptosCoin" />
        <Label>Quote adddress</Label>
        <Input ref={quoteCoinRef} placeholder="0x2::usd_coin::USDCoin" />
        <Label>Lot size</Label>
        <Input ref={lotSizeRef} type="number" />
        <Label>Tick size</Label>
        <Input ref={tickSizeRef} type="number" />
        <Label>Min size</Label>
        <Input ref={minSizeRef} type="number" />
        <Button
          css={css`
            margin-bottom: 52px;
          `}
          variant="primary"
          size="sm"
          onClick={async () => {
            try {
              await registerMarket(
                u64(parseInt(lotSizeRef.current?.value || "0")),
                u64(parseInt(tickSizeRef.current?.value || "0")),
                u64(parseInt(minSizeRef.current?.value || "0")),
                parseTypeTagOrThrow(baseCoinRef.current?.value || ""),
                parseTypeTagOrThrow(quoteCoinRef.current?.value || ""),
              );
            } catch (e) {
              toast.error(e.message);
            }
          }}
        >
          Register
        </Button>
      </FlexCol>
    </>
  );
};
