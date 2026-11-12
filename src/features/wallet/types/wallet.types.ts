export interface GetRestaurantWalletOverviewOutputDTO {
  walletId: string | null;
  restaurantId: string;
  balancePaise: number;
  currency: string;
  isLocked: boolean;
  linkedBankAccount: {
    isLinked: boolean;
    bankName: string | null;
    accountNumberMasked: string | null;
  } | null;
  todayStats: {
    todayCreditsPaise: number;
    todayRefundsPaise: number;
    withdrawnPaise: number;
    pendingPayoutsCount: number;
  };
}

export type WalletOverview = GetRestaurantWalletOverviewOutputDTO;

export interface GetRestaurantWalletOverviewApiResponse {
  data: GetRestaurantWalletOverviewOutputDTO;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface BankAccountInput {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
}

export interface WithdrawInput {
  amountPaise: number;
  mode: "IMPS";
}

export interface WithdrawRequest {
  input: WithdrawInput;
  idempotencyKey: string;
}
