export * from "./admin/admin.routes.constants";
export * from "./customer/customer.routes.constants";
export * from "./restaurant/restaurant.routes.constants";
export * from "./staff/staff.routes.constants";

export const ROOT_ROUTE_PATHS = {
  SUBSCRIPTION: "subscription",
  INVITATIONS: {
    ROOT: "invitations",
    ACCEPT: "accept",
  },
  ADMIN: "admin",
  RESTAURANT: "restaurant",
  STAFF: "staff",
  CATCH_ALL: "*",
} as const;

export const ROOT_ROUTES = {
  SUBSCRIPTION: "/subscription",
  INVITATIONS_ACCEPT: "/invitations/accept",
  ADMIN: "/admin",
  RESTAURANT: "/restaurant",
  STAFF: "/staff",
} as const;
