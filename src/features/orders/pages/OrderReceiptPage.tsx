import { Navigate, useParams } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/customer/customer.routes.constants";

export default function OrderReceiptPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return <Navigate to={CUSTOMER_ROUTES.ORDER_DETAILS(orderId ?? "")} replace />;
}
