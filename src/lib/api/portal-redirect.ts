import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  RESTAURANT_ROUTES,
  STAFF_ROUTES,
} from "@/app/router/routes.constants";
import { USER_ROLES } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";

const EXEMPT_RESTAURANT_PATHS = [
  RESTAURANT_ROUTES.LOGIN,
  RESTAURANT_ROUTES.VERIFY,
  RESTAURANT_ROUTES.ONBOARDING.ROOT,
];

const isExemptRestaurantPath = (targetPath: string): boolean =>
  EXEMPT_RESTAURANT_PATHS.some(
    (exempt) => targetPath === exempt || targetPath.startsWith(`${exempt}/`),
  );

export function redirectToPortalLogin(
  targetWindow: Window | { location: { pathname: string; href: string } } = window,
): void {
  if (typeof targetWindow === "undefined" || !targetWindow.location) return;

  const user = useAuthStore.getState().user;
  const role = user?.role?.toUpperCase();

  const path = targetWindow.location.pathname || "";
  const isAdminRoute = path === ADMIN_ROUTES.ROOT || path.startsWith(`${ADMIN_ROUTES.ROOT}/`);
  const isStaffRoute = path === STAFF_ROUTES.ROOT || path.startsWith(`${STAFF_ROUTES.ROOT}/`);
  const isRestaurantRoute =
    path === RESTAURANT_ROUTES.ROOT || path.startsWith(`${RESTAURANT_ROUTES.ROOT}/`);

  if (role === USER_ROLES.ADMIN || isAdminRoute) {
    if (path !== ADMIN_ROUTES.LOGIN) {
      targetWindow.location.href = ADMIN_ROUTES.LOGIN;
    }
  } else if (
    role === USER_ROLES.STAFF ||
    role === USER_ROLES.RESTAURANT_STAFF ||
    isStaffRoute
  ) {
    if (path !== STAFF_ROUTES.LOGIN) {
      targetWindow.location.href = STAFF_ROUTES.LOGIN;
    }
  } else if (
    role === USER_ROLES.RESTAURANT_ADMIN ||
    role === USER_ROLES.RESTAURANT_OWNER ||
    isRestaurantRoute
  ) {
    if (!isExemptRestaurantPath(path)) {
      targetWindow.location.href = RESTAURANT_ROUTES.LOGIN;
    }
  } else if (path !== CUSTOMER_ROUTES.AUTH.LOGIN) {
    targetWindow.location.href = CUSTOMER_ROUTES.AUTH.LOGIN;
  }
}

