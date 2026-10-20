import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  RESTAURANT_ROUTES,
  STAFF_ROUTES,
} from "@/app/router/routes.constants";

export function getPortalLoginRedirect(path: string): string {
  const isPathUnder = (root: string) => path === root || path.startsWith(`${root}/`);

  const isAdminRoute = isPathUnder(ADMIN_ROUTES.ROOT);
  const isStaffRoute = isPathUnder(STAFF_ROUTES.ROOT);
  const isRestaurantRoute =
    isPathUnder(RESTAURANT_ROUTES.ROOT) && !path.startsWith(CUSTOMER_ROUTES.RESTAURANTS);

  if (isAdminRoute && path !== ADMIN_ROUTES.LOGIN) {
    return ADMIN_ROUTES.LOGIN;
  }
  if (isStaffRoute && path !== STAFF_ROUTES.LOGIN) {
    return STAFF_ROUTES.LOGIN;
  }
  if (
    isRestaurantRoute &&
    !path.startsWith(RESTAURANT_ROUTES.LOGIN) &&
    !path.startsWith(RESTAURANT_ROUTES.VERIFY) &&
    !path.startsWith(RESTAURANT_ROUTES.ONBOARDING.ROOT)
  ) {
    return RESTAURANT_ROUTES.LOGIN;
  }
  if (
    !isAdminRoute &&
    !isStaffRoute &&
    !isRestaurantRoute &&
    path !== CUSTOMER_ROUTES.AUTH.LOGIN
  ) {
    return CUSTOMER_ROUTES.AUTH.LOGIN;
  }
  return "";
}

export function redirectToPortalLogin(): void {
  if (typeof window === "undefined" || !window.location) return;

  const path = window.location.pathname || "";
  const target = getPortalLoginRedirect(path);
  if (target) {
    window.location.href = target;
  }
}
