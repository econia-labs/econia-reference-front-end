import React, { ButtonHTMLAttributes } from "react";

import { useAptos } from "../hooks/useAptos";
import { Button } from "./Button";

/// This button will default to `Connect Wallet` if the user has not yet
/// connected their wallet.
export const TxButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    size: "sm" | "md" | "lg";
    variant: "primary" | "secondary";
  }
> = ({ children, ...rest }) => {
  const { account, connect } = useAptos();
  if (account === null) {
    return (
      <Button
        size={rest.size}
        variant={rest.variant}
        onClick={() => connect()}
        disabled={false}
      >
        Connect Wallet
      </Button>
    );
  }
  return <Button {...rest}>{children}</Button>;
};
