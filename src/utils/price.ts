export const toDecimalPrice = ({
  price,
  lotSize,
  tickSize,
  baseCoinDecimals,
  quoteCoinDecimals,
}: {
  price: number;
  lotSize: number;
  tickSize: number;
  baseCoinDecimals: number;
  quoteCoinDecimals: number;
}) => {
  const lotsPerUnit = 10 ** baseCoinDecimals / lotSize;
  const pricePerLot = (price * tickSize) / 10 ** quoteCoinDecimals;
  return pricePerLot * lotsPerUnit;
};
