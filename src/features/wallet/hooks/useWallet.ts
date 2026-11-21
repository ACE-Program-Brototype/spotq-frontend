import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WALLET_QUERY_KEYS } from "@/features/wallet/constants/wallet.constants";
import { walletService } from "@/features/wallet/services/wallet.service";
import type { WalletLedgerEntriesParams } from "@/features/wallet/types/wallet.types";

export function useWalletOverview() {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.overview(),
    queryFn: walletService.getOverview,
  });
}

export function useWalletLedgerEntries(params: WalletLedgerEntriesParams) {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.ledgerEntries(params),
    queryFn: () => walletService.getLedgerEntries(params),
    placeholderData: keepPreviousData,
  });
}

export function useLinkWalletBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletService.linkBankAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.all }),
  });
}

export function useWithdrawWalletFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletService.withdraw,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.all }),
  });
}
