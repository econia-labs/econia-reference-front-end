import { U64, U128, u64 } from "@manahippo/move-to-ts";
import BigNumber from "bignumber.js";

import React from "react";

import { css } from "@emotion/react";

import { Loading } from "../../components/Loading";
import { TxButton } from "../../components/TxButton";
import { ASK, BID } from "../../constants";
import { ConnectWalletButton } from "../../hooks/ConnectWalletButton";
import { useAptos } from "../../hooks/useAptos";
// import { useCancelAllOrders } from "../../hooks/useCancelAllOrders";
import { useCancelOrder } from "../../hooks/useCancelOrder";
import { CoinInfo, useCoinInfo } from "../../hooks/useCoinInfo";
import { useMarketAccount } from "../../hooks/useMarketAccount";
import { RegisteredMarket } from "../../hooks/useRegisteredMarkets";
import { toDecimalPrice, toDecimalSize } from "../../utils/units";

const TableRow: React.FC<{
  market: RegisteredMarket;
  order: {
    counter: BigNumber;
    side: boolean;
    size: BigNumber;
    price: BigNumber;
    marketOrderId: U128;
  };
  baseCoinInfo: CoinInfo;
  quoteCoinInfo: CoinInfo;
  cancelOrder: (marketId: U64, side: boolean, orderId: U128) => Promise<void>;
}> = ({ market, order, baseCoinInfo, quoteCoinInfo, cancelOrder }) => {
  return (
    <tr>
      <td
        css={(theme) => css`
          color: ${order.side === BID
            ? theme.colors.green.primary
            : theme.colors.red.primary};
        `}
      >
        {order.side === BID ? "BID" : "ASK"}
      </td>
      <td>
        {toDecimalPrice({
          price: order.price,
          lotSize: market.lotSize,
          tickSize: market.tickSize,
          baseCoinDecimals: baseCoinInfo.decimals,
          quoteCoinDecimals: quoteCoinInfo.decimals,
        }).toString()}{" "}
        {quoteCoinInfo.symbol}
      </td>
      <td>
        {toDecimalSize({
          size: order.size,
          lotSize: market.lotSize,
          baseCoinDecimals: baseCoinInfo.decimals,
        }).toString()}{" "}
        {baseCoinInfo.symbol}
      </td>
      <td>
        <TxButton
          css={css`
            width: 144px;
          `}
          variant="secondary"
          size="sm"
          onClick={async () => {
            console.log(
              order.counter.toString(),
              order.marketOrderId.toJsNumber(),
              order.side,
              order.size.toString(),
              order.price.toString(),
            );
            await cancelOrder(u64(market.marketId), ASK, order.marketOrderId);
          }}
        >
          Cancel
        </TxButton>
      </td>
    </tr>
  );
};

export const OrdersTable: React.FC<{
  className?: string;
  market?: RegisteredMarket;
  showClosed?: boolean;
}> = ({ className, market, showClosed }) => {
  return (
    <div
      className={className}
      css={css`
        width: 100%;
      `}
    >
      <h3>Open Orders</h3>
      {market ? (
        <OrdersTableInner market={market} showClosed={showClosed} />
      ) : (
        <Loading />
      )}
    </div>
  );
};

const OrdersTableInner: React.FC<{
  market: RegisteredMarket;
  showClosed?: boolean;
}> = ({ market, showClosed }) => {
  const { account, connected } = useAptos();
  const marketAccount = useMarketAccount(market.marketId, account?.address);
  const baseCoinInfo = useCoinInfo(market.baseType);
  const quoteCoinInfo = useCoinInfo(market.quoteType);
  //   const cancelAllOrders = useCancelAllOrders();
  const cancelOrder = useCancelOrder();

  if (!connected)
    return (
      <>
        <p
          css={css`
            margin-bottom: 8px;
          `}
        >
          Connect your Aptos wallet to view your open orders.
        </p>
        <ConnectWalletButton variant="primary" size="sm" />
      </>
    );
  if (marketAccount.isLoading || !marketAccount.data)
    return <div>Loading orders...</div>;
  else if (
    baseCoinInfo.isLoading ||
    !baseCoinInfo.data ||
    quoteCoinInfo.isLoading ||
    !quoteCoinInfo.data
  )
    return <div>Loading coin information...</div>;

  const allOrders = [];
  for (const ask of marketAccount.data.asks) {
    if (!showClosed && ask.price.eq(0)) continue;
    allOrders.push({
      side: ASK,
      ...ask,
    });
  }
  for (const bid of marketAccount.data.bids) {
    if (!showClosed && bid.price.eq(0)) continue;
    allOrders.push({
      side: BID,
      ...bid,
    });
  }

  return (
    <>
      <h3>Open Orders</h3>
      {allOrders.length > 0 ? (
        <div
          css={css`
            height: 220px;
            overflow-x: scroll;
            // This padding prevents the scrollbar from overlapping the table
            padding-right: 8px;
          `}
        >
          <table
            css={(theme) => css`
              width: 100%;
              text-align: right;
              border-collapse: collapse;
              td:first-of-type {
                text-align: left;
              }
              thead {
                position: sticky;
                top: 0px;
                z-index: 1;
                background: ${theme.colors.grey[800]};
                td {
                  padding-bottom: 12px;
                }
              }
              tbody {
                tr:first-of-type {
                  border-top: 1px solid ${theme.colors.grey[600]};
                }
                tr {
                  border-bottom: 1px solid ${theme.colors.grey[600]};
                }
              }
            `}
          >
            <thead>
              <tr>
                <td>Side</td>
                <td>Price</td>
                <td>Size</td>
                <td />
              </tr>
            </thead>
            <tbody>
              {allOrders
                .sort((oA, oB) => oB.counter.comparedTo(oA.counter))
                .map((order, i) => {
                  return (
                    <TableRow
                      key={i}
                      market={market}
                      order={order}
                      baseCoinInfo={baseCoinInfo.data}
                      quoteCoinInfo={quoteCoinInfo.data}
                      cancelOrder={cancelOrder}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No open orders.</div>
      )}
      {/* {connected && (
        <span
          css={(theme) => css`
            font-size: 14px;
            padding: 8px 8px;
            cursor: pointer;
            color: ${theme.colors.red.primary};
            :hover {
              background-color: ${theme.colors.grey[600]};
            }
          `}
          onClick={async () => {
            await cancelAllOrders(u64(market.marketId));
          }}
        >
          Cancel All Orders
        </span>
      )} */}
    </>
  );
};
