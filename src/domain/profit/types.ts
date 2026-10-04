export type CurrencyCode = "CNY" | "USD" | "EUR" | "GBP";

export interface ProfitInput {
  itemPrice: number;
  buyerShipping: number;
  discount: number;
  productCost: number;
  fulfillmentCost: number;
  packagingCost: number;
  advertisingCost: number;
  otherFixedCost: number;
  platformFeeRate: number;
  paymentFeeRate: number;
  paymentFixedFee: number;
  taxRate: number;
  refundLossRate: number;
  targetMarginRate: number;
  monthlyOrders: number;
}

export type ProfitInputKey = keyof ProfitInput;

export interface CostBreakdownItem {
  id: "product" | "fulfillment" | "advertising" | "fees" | "risk" | "other";
  label: string;
  value: number;
}

export interface ProfitResult {
  input: ProfitInput;
  grossRevenue: number;
  platformFee: number;
  paymentFee: number;
  taxAllowance: number;
  refundLoss: number;
  percentageCosts: number;
  fixedCosts: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
  roi: number | null;
  totalVariableRate: number;
  breakEvenItemPrice: number | null;
  targetItemPrice: number | null;
  maximumAdvertisingCost: number;
  breakEvenRoas: number | null;
  monthlyProfit: number;
  costBreakdown: CostBreakdownItem[];
  validationMessage: string | null;
}
