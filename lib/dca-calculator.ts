export type DcaFrequency = "weekly" | "biweekly" | "monthly";

export type DcaInputs = {
  amountPerBuy: number;
  numberOfBuys: number;
  startingPrice: number;
  endingPrice: number;
  frequency: DcaFrequency;
};

export type DcaPurchase = {
  index: number;
  price: number;
  invested: number;
  bitcoinBought: number;
  cumulativeInvested: number;
  cumulativeBitcoin: number;
};

export type DcaSummary = {
  totalInvested: number;
  totalBitcoin: number;
  averageBuyPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  lumpSumBitcoin: number;
  lumpSumDifference: number;
};

export type DcaResult = {
  purchases: DcaPurchase[];
  summary: DcaSummary;
};

function interpolatePrice(
  startingPrice: number,
  endingPrice: number,
  index: number,
  totalBuys: number,
) {
  if (totalBuys <= 1) {
    return startingPrice;
  }

  const progress = index / (totalBuys - 1);
  return startingPrice + (endingPrice - startingPrice) * progress;
}

export function getFrequencyLabel(frequency: DcaFrequency) {
  switch (frequency) {
    case "weekly":
      return "semanal";
    case "biweekly":
      return "quincenal";
    case "monthly":
      return "mensual";
    default:
      return "periódica";
  }
}

export function calculateDcaPlan(inputs: DcaInputs): DcaResult {
  const purchases: DcaPurchase[] = [];
  let cumulativeInvested = 0;
  let cumulativeBitcoin = 0;

  for (let index = 0; index < inputs.numberOfBuys; index += 1) {
    const price = interpolatePrice(
      inputs.startingPrice,
      inputs.endingPrice,
      index,
      inputs.numberOfBuys,
    );
    const invested = inputs.amountPerBuy;
    const bitcoinBought = invested / price;

    cumulativeInvested += invested;
    cumulativeBitcoin += bitcoinBought;

    purchases.push({
      index: index + 1,
      price,
      invested,
      bitcoinBought,
      cumulativeInvested,
      cumulativeBitcoin,
    });
  }

  const totalInvested = cumulativeInvested;
  const totalBitcoin = cumulativeBitcoin;
  const averageBuyPrice = totalBitcoin > 0 ? totalInvested / totalBitcoin : 0;
  const currentValue = totalBitcoin * inputs.endingPrice;
  const profitLoss = currentValue - totalInvested;
  const profitLossPercentage =
    totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
  const lumpSumBitcoin = totalInvested / inputs.startingPrice;
  const lumpSumDifference = totalBitcoin - lumpSumBitcoin;

  return {
    purchases,
    summary: {
      totalInvested,
      totalBitcoin,
      averageBuyPrice,
      currentValue,
      profitLoss,
      profitLossPercentage,
      lumpSumBitcoin,
      lumpSumDifference,
    },
  };
}
