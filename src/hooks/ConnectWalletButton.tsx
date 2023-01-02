import React from "react";

import { Button } from "../components/Button";
import { useAptos } from "./useAptos";

export const ConnectWalletButton: React.FC<{
  size: "sm" | "md" | "lg";
  variant: "primary" | "secondary" | "outline";
  className?: string;
}> = ({ className, size, variant }) => {
  const { connect } = useAptos();
  return (
    <Button
      size={size}
      variant={variant}
      onClick={connect}
      className={className}
    >
      Connect Wallet
    </Button>
  );
};
