export type Role = "ADMIN" | "CUSTOMER" | "RESTAURANT_ADMIN" | "RESTAURANT_STAFF";

export type User = {
  _id: string;
  name: string;
  email: string;
  role?: Role;
  created_at: string;
};
