export function redirectToPortalLogin(): void {
  if (typeof window === "undefined" || !window.location) return;

  const path = window.location.pathname || "";
  const isAdminRoute = path.startsWith("/admin");
  const isStaffRoute = path.startsWith("/staff");
  const isRestaurantRoute = path.startsWith("/restaurant");

  if (isAdminRoute && path !== "/admin/login") {
    window.location.href = "/admin/login";
  } else if (isStaffRoute && path !== "/staff/login") {
    window.location.href = "/staff/login";
  } else if (
    isRestaurantRoute &&
    !path.startsWith("/restaurant/email") &&
    !path.startsWith("/restaurant/otp") &&
    !path.startsWith("/restaurant/onboarding")
  ) {
    window.location.href = "/restaurant/email/verification";
  } else if (!isAdminRoute && !isStaffRoute && !isRestaurantRoute && path !== "/login") {
    window.location.href = "/login";
  }
}
