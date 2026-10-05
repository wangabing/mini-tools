export type CurrencyCode = "CNY" | "USD" | "EUR" | "GBP";

export type CalculationMode = "quick" | "professional";
export type SalesChannel = "organic" | "advertising" | "creator";
export type FeeBasis = "item-amount" | "buyer-paid" | "seller-settlement";

export interface ProfitInput {
  calculationMode: CalculationMode;
  salesChannel: SalesChannel;
  itemPrice: number;
  buyerShipping: number;
  discount: number;
  platformSubsidy: number;
  productCost: number;
  fulfillmentCost: number;
  packagingCost: number;
  advertisingCost: number;
  insuranceCost: number;
  otherFixedCost: number;
  platformFeeRate: number;
  platformFeeFixed: number;
  platformFeeBase: FeeBasis;
  paymentFeeRate: number;
  paymentFixedFee: number;
  paymentFeeBase: FeeBasis;
  creatorCommissionRate: number;
  creatorCommissionFixed: number;
  creatorCommissionBase: FeeBasis;
  taxRate: number;
  taxFeeBase: FeeBasis;
  refundLossRate: number;
  returnRate: number;
  returnShippingCost: number;
  returnHandlingCost: number;
  returnValueLossRate: number;
  nonRefundableFeeRate: number;
  targetMarginRate: number;
  monthlyOrders: number;
  monthlyPlatformCost: number;
  monthlyOperatingCost: number;
}

export type ProfitNumericInputKey = {
  [Key in keyof ProfitInput]: ProfitInput[Key] extends number ? Key : never;
}[keyof ProfitInput];

export type ProfitInputKey = ProfitNumericInputKey;

export interface CostBreakdownItem {
  id:
    | "product"
    | "fulfillment"
    | "advertising"
    | "fees"
    | "risk"
    | "after-sales"
    | "recurring"
    | "other";
  label: string;
  value: number;
}

export interface ProfitResult {
  input: ProfitInput;
  grossRevenue: number;
  itemAmount: number;
  buyerPaid: number;
  sellerSettlement: number;
  platformFee: number;
  paymentFee: number;
  creatorCommission: number;
  transactionFees: number;
  taxAllowance: number;
  refundLoss: number;
  singleReturnLoss: number;
  expectedReturnLoss: number;
  recurringCostAllocation: number | null;
  monthlyRecurringCosts: number;
  percentageCosts: number;
  fixedCosts: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
  roi: number | null;
  totalVariableRate: number;
  breakEvenItemPrice: number | null;
  targetItemPrice: number | null;
  maximumAdvertisingCost: number | null;
  breakEvenRoas: number | null;
  monthlyProfit: number;
  costBreakdown: CostBreakdownItem[];
  validationMessage: string | null;
}
