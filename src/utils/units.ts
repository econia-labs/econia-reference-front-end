export const fromDecimalPrice = ({
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
  const ticksPerUnit = (price * 10 ** quoteCoinDecimals) / tickSize;
  const lotsPerUnit = 10 ** baseCoinDecimals / lotSize;
  return ticksPerUnit / lotsPerUnit;
};

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

export const fromDecimalSize = ({
  size,
  lotSize,
  baseCoinDecimals,
}: {
  size: number;
  lotSize: number;
  baseCoinDecimals: number;
}) => {
  return Math.floor((size * 10 ** baseCoinDecimals) / lotSize);
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

export const toDecimalQuote = ({
  ticks,
  tickSize,
  quoteCoinDecimals,
}: {
  ticks: number;
  tickSize: number;
  quoteCoinDecimals: number;
}) => {
  return (ticks * tickSize) / 10 ** quoteCoinDecimals;
};
