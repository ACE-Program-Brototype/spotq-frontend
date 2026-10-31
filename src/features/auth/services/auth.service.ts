/**
 * Auth Service Facade
 * Re-exports modularized authentication services across customer, staff, restaurant, and admin domains.
 */

export type { ApiResponse } from "@/types/api.types";

export * from "./admin-auth.service";
export * from "./customer-auth.service";
export * from "./restaurant-auth.service";
export * from "./staff-auth.service";
