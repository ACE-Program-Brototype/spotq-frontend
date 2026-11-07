import { ShoppingBag } from "lucide-react";
import { DataTable } from "@/components/common/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CUSTOMER_MESSAGES } from "../constants/customer.constants";
import { DUMMY_CUSTOMER_ORDERS } from "../mocks/customer-orders.mock";

interface DummyCustomerOrder {
  id: string;
  date: string;
  items: string;
  total: string;
  status: string;
}

export function CustomerOrdersSection() {
  return (
    <Card className="border-slate-200/80 shadow-xs bg-white">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="size-4 text-slate-600" />
          <CardTitle className="text-base font-bold text-slate-800">
            {CUSTOMER_MESSAGES.ORDERS_SECTION_TITLE}
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500">
          {CUSTOMER_MESSAGES.ORDERS_SECTION_SUBTITLE}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable<DummyCustomerOrder>
          data={DUMMY_CUSTOMER_ORDERS}
          columns={[
            {
              key: "id",
              header: CUSTOMER_MESSAGES.COL_ORDER_ID,
              accessor: "id",
              className: "font-mono font-semibold text-slate-900",
            },
            {
              key: "date",
              header: CUSTOMER_MESSAGES.COL_ORDER_DATE,
              accessor: "date",
              className: "text-slate-500",
            },
            {
              key: "items",
              header: CUSTOMER_MESSAGES.COL_ORDER_ITEMS,
              accessor: "items",
              className: "text-slate-800 font-medium truncate max-w-xs",
            },
            {
              key: "total",
              header: CUSTOMER_MESSAGES.COL_ORDER_TOTAL,
              accessor: "total",
              className: "font-bold text-slate-900",
            },
            {
              key: "status",
              header: CUSTOMER_MESSAGES.COL_ORDER_STATUS,
              align: "right",
              cell: ({ row: order }) => (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold"
                >
                  {order.status}
                </Badge>
              ),
            },
          ]}
          theme="admin"
          className="border-0 rounded-none shadow-none"
          headerClassName="bg-[#f0edf1]/60 text-slate-500 font-semibold border-b border-slate-200/80"
        />
      </CardContent>
    </Card>
  );
}
