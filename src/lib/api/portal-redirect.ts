import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  RESTAURANT_ROUTES,
  STAFF_ROUTES,
} from "@/app/router/routes.constants";

export function redirectToPortalLogin(): void {
  if (typeof window === "undefined" || !window.location) return;

  const path = window.location.pathname || "";
  const isAdminRoute = path.startsWith(ADMIN_ROUTES.ROOT);
  const isStaffRoute = path.startsWith(STAFF_ROUTES.ROOT);
  const isRestaurantRoute = path.startsWith(RESTAURANT_ROUTES.ROOT);

  if (isAdminRoute && path !== ADMIN_ROUTES.LOGIN) {
    window.location.href = ADMIN_ROUTES.LOGIN;
  } else if (isStaffRoute && path !== STAFF_ROUTES.LOGIN) {
    window.location.href = STAFF_ROUTES.LOGIN;
  } else if (
    isRestaurantRoute &&
    !path.startsWith(RESTAURANT_ROUTES.LOGIN) &&
    !path.startsWith(RESTAURANT_ROUTES.VERIFY) &&
    !path.startsWith(RESTAURANT_ROUTES.ONBOARDING.ROOT)
  ) {
    window.location.href = RESTAURANT_ROUTES.LOGIN;
  } else if (
    !isAdminRoute &&
    !isStaffRoute &&
    !isRestaurantRoute &&
    path !== CUSTOMER_ROUTES.AUTH.LOGIN
  ) {
    window.location.href = CUSTOMER_ROUTES.AUTH.LOGIN;
  }
}
