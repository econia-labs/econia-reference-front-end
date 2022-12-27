import React from "react";

import { useAptos } from "../hooks/useAptos";
import { ExternalLink } from "./ExternalLink";

export const TxLink: React.FC<{
  className?: string;
  txId: string | number;
}> = ({ className, txId }) => {
  const { createTxLink } = useAptos();
  return (
    <ExternalLink className={className} href={createTxLink(txId)}>
      {txId}
    </ExternalLink>
  );
};
