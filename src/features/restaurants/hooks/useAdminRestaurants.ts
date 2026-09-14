import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  RESTAURANT_DEFAULTS,
  RESTAURANT_FILTER_PLANS,
  RESTAURANT_FILTER_STATUS,
  RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER,
  type RestaurantFilterPlanType,
  type RestaurantFilterStatusType,
  type RestaurantSubscriptionActiveFilterType,
} from "../constants/restaurant.constants";
import { restaurantService } from "../services/restaurant.service";
import type { RestaurantSortByType, RestaurantSortOrderType } from "../types/restaurant.types";

export interface UseAdminRestaurantsOptions {
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: RestaurantFilterStatusType;
  initialPlan?: RestaurantFilterPlanType;
  initialSubscriptionActive?: RestaurantSubscriptionActiveFilterType;
  initialSearch?: string;
  initialCreatedFrom?: string;
  initialCreatedTo?: string;
  initialSortBy?: RestaurantSortByType;
  initialSortOrder?: RestaurantSortOrderType;
}

export function useAdminRestaurants(options?: UseAdminRestaurantsOptions) {
  const [page, setPage] = useState<number>(options?.initialPage ?? RESTAURANT_DEFAULTS.PAGE);
  const [limit, setLimit] = useState<number>(options?.initialLimit ?? RESTAURANT_DEFAULTS.LIMIT);
  const [status, setStatus] = useState<RestaurantFilterStatusType>(
    options?.initialStatus ?? RESTAURANT_DEFAULTS.FILTER_STATUS,
  );
  const [plan, setPlan] = useState<RestaurantFilterPlanType>(
    options?.initialPlan ?? RESTAURANT_DEFAULTS.FILTER_PLAN,
  );
  const [isSubscriptionActive, setIsSubscriptionActive] =
    useState<RestaurantSubscriptionActiveFilterType>(
      options?.initialSubscriptionActive ?? RESTAURANT_DEFAULTS.FILTER_SUBSCRIPTION_ACTIVE,
    );
  const [search, setSearch] = useState<string>(options?.initialSearch ?? "");
  const [createdFrom, setCreatedFrom] = useState<string>(options?.initialCreatedFrom ?? "");
  const [createdTo, setCreatedTo] = useState<string>(options?.initialCreatedTo ?? "");
  const [sortBy, setSortBy] = useState<RestaurantSortByType>(
    options?.initialSortBy ?? RESTAURANT_DEFAULTS.SORT_BY,
  );
  const [sortOrder, setSortOrder] = useState<RestaurantSortOrderType>(
    options?.initialSortOrder ?? RESTAURANT_DEFAULTS.SORT_ORDER,
  );

  const debouncedSearch = useDebounce(search, RESTAURANT_DEFAULTS.SEARCH_DEBOUNCE_MS);

  const queryKey = [
    "admin",
    "restaurants",
    {
      page,
      limit,
      search: debouncedSearch,
      status,
      plan,
      isSubscriptionActive,
      createdFrom,
      createdTo,
      sortBy,
      sortOrder,
    },
  ];

  const query = useQuery({
    queryKey,
    queryFn: () =>
      restaurantService.getAdminRestaurants({
        page,
        limit,
        search: debouncedSearch,
        status,
        plan,
        is_subscription_active: isSubscriptionActive,
        created_from: createdFrom || undefined,
        created_to: createdTo || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleStatusChange = (newStatus: RestaurantFilterStatusType) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handlePlanChange = (newPlan: RestaurantFilterPlanType) => {
    setPlan(newPlan);
    setPage(1);
  };

  const handleSubscriptionActiveChange = (newActive: RestaurantSubscriptionActiveFilterType) => {
    setIsSubscriptionActive(newActive);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortByChange = (newSortBy: RestaurantSortByType) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const handleSort = (field: RestaurantSortByType) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus(RESTAURANT_FILTER_STATUS.ALL);
    setPlan(RESTAURANT_FILTER_PLANS.ALL);
    setIsSubscriptionActive(RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER.ALL);
    setCreatedFrom("");
    setCreatedTo("");
    setSortBy(RESTAURANT_DEFAULTS.SORT_BY);
    setSortOrder(RESTAURANT_DEFAULTS.SORT_ORDER);
    setPage(1);
  };

  const isFiltered =
    status !== RESTAURANT_FILTER_STATUS.ALL ||
    plan !== RESTAURANT_FILTER_PLANS.ALL ||
    isSubscriptionActive !== RESTAURANT_SUBSCRIPTION_ACTIVE_FILTER.ALL ||
    search.trim().length > 0 ||
    createdFrom.length > 0 ||
    createdTo.length > 0 ||
    sortBy !== RESTAURANT_DEFAULTS.SORT_BY ||
    sortOrder !== RESTAURANT_DEFAULTS.SORT_ORDER;

  return {
    ...query,
    restaurants: query.data?.restaurants ?? [],
    pagination: query.data?.pagination,
    page,
    setPage,
    limit,
    setLimit: handleLimitChange,
    status,
    setStatus: handleStatusChange,
    plan,
    setPlan: handlePlanChange,
    isSubscriptionActive,
    setIsSubscriptionActive: handleSubscriptionActiveChange,
    search,
    setSearch: handleSearchChange,
    debouncedSearch,
    createdFrom,
    setCreatedFrom,
    createdTo,
    setCreatedTo,
    sortBy,
    setSortBy: handleSortByChange,
    sortOrder,
    setSortOrder,
    toggleSortOrder: handleToggleSortOrder,
    handleSort,
    resetFilters: handleResetFilters,
    isFiltered,
  };
}
