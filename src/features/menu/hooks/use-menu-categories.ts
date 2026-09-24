import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { menuService } from "@/features/menu/services/menu.service";
import type { CreateCategoryPayload, MenuCategory } from "@/features/menu/types/menu.types";

export const MENU_CATEGORIES_QUERY_KEY = "menuCategories";

export function useMenuCategories(restaurantId: string) {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [MENU_CATEGORIES_QUERY_KEY, restaurantId],
    queryFn: () => menuService.getCategories(restaurantId),
    enabled: Boolean(restaurantId),
    staleTime: 60 * 1000,
  });

  const createCategoryMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      menuService.createCategory(restaurantId, payload),
    onSuccess: (newCategory: MenuCategory) => {
      queryClient.setQueryData(
        [MENU_CATEGORIES_QUERY_KEY, restaurantId],
        (old: MenuCategory[] | undefined) => [...(old || []), newCategory],
      );
      toast.success(MENU_MESSAGES.CATEGORY_CREATED_SUCCESS);
    },
    onError: (err: Error) => {
      toast.error(err.message || MENU_MESSAGES.CATEGORY_CREATE_FAILED);
    },
  });

  return {
    categories,
    isLoading,
    isError,
    error,
    refetch,
    createCategory: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
  };
}
