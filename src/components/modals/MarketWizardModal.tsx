import { parseTypeTagOrThrow, u64 } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { css } from "@emotion/react";

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

enum Mode {
  SelectMarket,
  RegisterMarket,
}

export const MarketWizardModal: React.FC<{
  showModal: boolean;
  closeModal: () => void;
  markets: RegisteredMarket[];
  setMarket: (market: RegisteredMarket) => void;
}> = ({ showModal, closeModal, markets, setMarket }) => {
  const [mode, setMode] = useState(Mode.SelectMarket);
  return (
    <BaseModal isOpen={showModal} onRequestClose={closeModal}>
      {mode === Mode.SelectMarket ? (
        <SelectMarketView
          markets={markets}
          setMarket={(market) => {
            setMarket(market);
            closeModal();
          }}
          onRegisterMarket={() => setMode(Mode.RegisterMarket)}
        />
      ) : (
        <RegisterMarketView onSelectMarket={() => setMode(Mode.SelectMarket)} />
      )}
    </BaseModal>
  );
};

const SelectMarketView: React.FC<{
  markets: RegisteredMarket[];
  setMarket: (market: RegisteredMarket) => void;
  onRegisterMarket: () => void;
}> = ({ markets, setMarket, onRegisterMarket }) => {
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
      <div
        css={css`
          text-align: center;
          font-size: 12px;
          margin-top: 32px;
          margin-bottom: 52px;
        `}
      >
        <span>Don&apos;t see the market you&apos;re looking for?</span>{" "}
        <span
          css={(theme) => css`
            color: ${theme.colors.purple.primary};
            cursor: pointer;
            :hover {
              text-decoration: underline;
            }
          `}
          onClick={onRegisterMarket}
        >
          Register a new market
        </span>
      </div>
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

const RegisterMarketView: React.FC<{ onSelectMarket: () => void }> = ({
  onSelectMarket,
}) => {
  const registerMarket = useRegisterMarket();
  const baseCoinRef = React.useRef<HTMLInputElement>(null);
  const quoteCoinRef = React.useRef<HTMLInputElement>(null);
  const lotSizeRef = React.useRef<HTMLInputElement>(null);
  const tickSizeRef = React.useRef<HTMLInputElement>(null);
  const minSizeRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        css={(theme) => css`
          width: fit-content;
          margin-top: 52px;
          font-size: 12px;
          margin-bottom: 16px;
          cursor: pointer;
          padding: 4px 0px;
          padding-right: 4px;
          :hover {
            color: ${theme.colors.purple.primary};
          }
        `}
        onClick={onSelectMarket}
      >
        {"<<"} BACK
      </div>
      <h4 css={css``}>Register Market</h4>
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
