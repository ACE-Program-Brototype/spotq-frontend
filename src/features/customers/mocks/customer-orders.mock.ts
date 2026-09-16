/**
 * Dummy order static placeholder data for the Admin Customer Details page.
 * TODO: Replace dummy order listing data with Order Service API integration
 *       when Order Management is implemented in a future phase.
 */
export const DUMMY_CUSTOMER_ORDERS = [
  {
    id: "ORD-98241",
    date: "2026-09-12",
    items: "2x Gourmet Burger Combo, 1x Iced Tea",
    total: "$34.50",
    status: "COMPLETED",
  },
  {
    id: "ORD-97104",
    date: "2026-09-08",
    items: "1x Margherita Pizza, 2x Garlic Bread",
    total: "$22.00",
    status: "COMPLETED",
  },
] as const;
