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

export const toDecimalSize = ({
  size,
  lotSize,
  baseCoinDecimals,
}: {
  size: number;
  lotSize: number;
  baseCoinDecimals: number;
}) => {
  return (size * lotSize) / 10 ** baseCoinDecimals;
};
