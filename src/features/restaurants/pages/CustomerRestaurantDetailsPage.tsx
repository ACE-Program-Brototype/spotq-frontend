import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { RestaurantCover } from "../components/Customer/RestaurantCover";
import { RestaurantMenuNavigation } from "../components/Customer/RestaurantMenuNavigation";
import { RestaurantMenuSections } from "../components/Customer/RestaurantMenuSections";
import { RestaurantOverview } from "../components/Customer/RestaurantOverview";
import { useCustomerRestaurantDetails } from "../hooks/useCustomerRestaurantDetails";
import type { CustomerRestaurantDetails } from "../types/customer-restaurant.types";

function RestaurantDetailsContent({ restaurant }: { restaurant: CustomerRestaurantDetails }) {
  const categories = useMemo(
    () => [...(restaurant.menu ?? [])].sort((a, b) => a.displayOrder - b.displayOrder),
    [restaurant.menu],
  );
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "overview");

  return (
    <>
      <RestaurantCover restaurant={restaurant} />
      <div className="mt-7 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <RestaurantMenuNavigation
          categories={categories}
          restaurant={restaurant}
          activeId={activeId}
          onActiveChange={setActiveId}
        />
        <div className="min-w-0 space-y-10">
          <RestaurantMenuSections categories={categories} />
          <RestaurantOverview restaurant={restaurant} />
        </div>
      </div>
    </>
  );
}

export default function CustomerRestaurantDetailsPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, error, refetch } = useCustomerRestaurantDetails(id);

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <Link
        to={CUSTOMER_ROUTES.HOME}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-[#f26500]"
      >
        <ArrowLeft className="size-4" />
        Back to restaurants
      </Link>
      {isLoading ? (
        <div className="h-[360px] animate-pulse rounded-[28px] bg-stone-100" />
      ) : isError || !data ? (
        <div role="alert" className="rounded-2xl border border-stone-200 p-12 text-center">
          <h1 className="text-xl font-bold">Couldn’t load this restaurant</h1>
          <p className="mt-2 text-sm text-stone-500">
            {(error as Error)?.message || "Please try again."}
          </p>
          <Button onClick={() => refetch()} className="mt-5 bg-[#ff6b00]">
            Try again
          </Button>
        </div>
      ) : (
        <RestaurantDetailsContent restaurant={data} />
      )}
    </div>
  );
}
