import { parseTypeTagOrThrow, u64 } from "@manahippo/move-to-ts";

import React from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

import { css, useTheme } from "@emotion/react";

import { useRegisterMarket } from "../../hooks/useRegisterMarket";
import { Button } from "../Button";
import { ExternalLink } from "../ExternalLink";
import { FlexCol } from "../FlexCol";
import { Input } from "../Input";
import { Label } from "../Label";

export const NewMarketModal: React.FC<{
  showModal: boolean;
  closeModal: () => void;
}> = ({ showModal, closeModal }) => {
  const registerMarket = useRegisterMarket();
  const theme = useTheme();
  const baseCoinRef = React.useRef<HTMLInputElement>(null);
  const quoteCoinRef = React.useRef<HTMLInputElement>(null);
  const lotSizeRef = React.useRef<HTMLInputElement>(null);
  const tickSizeRef = React.useRef<HTMLInputElement>(null);
  const minSizeRef = React.useRef<HTMLInputElement>(null);

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={closeModal}
      style={{
        content: {
          width: "800px",
          height: "620px",
          background: theme.colors.grey[800],
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: `1px solid ${theme.colors.purple.primary}`,
          borderRadius: "0px",
        },
        overlay: {
          background: "none",
          backdropFilter: "blur(5px)",
          zIndex: 3,
        },
      }}
    >
      <h1>Register Market</h1>
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
    </Modal>
  );
};
