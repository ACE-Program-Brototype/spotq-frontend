import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WALLET_QUERY_KEY } from "../constants/wallet.constants";
import { walletService } from "../services/wallet.service";

export function useWalletOverview() {
  return useQuery({
    queryKey: WALLET_QUERY_KEY.overview(),
    queryFn: walletService.getOverview,
  });
}

export function useLinkWalletBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletService.linkBankAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY.all }),
  });
}

export function useWithdrawWalletFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletService.withdraw,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY.all }),
  });
}
