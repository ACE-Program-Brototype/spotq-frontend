import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JoinQueueModal } from "@/features/queue/components/JoinQueueModal";
import { useActiveCustomerQueue } from "@/features/queue/hooks/use-active-customer-queue";
import type { ActiveCustomerTicket } from "@/features/queue/types/ring-alert.types";
import { getActiveCustomerTicket } from "@/features/queue/utils/active-queue.utils";
import { RestaurantCover } from "../components/Customer/RestaurantCover";
import { RestaurantMenuNavigation } from "../components/Customer/RestaurantMenuNavigation";
import { RestaurantMenuSections } from "../components/Customer/RestaurantMenuSections";
import { RestaurantOverview } from "../components/Customer/RestaurantOverview";
import { useCustomerRestaurantDetails } from "../hooks/useCustomerRestaurantDetails";
import type { CustomerRestaurantDetails } from "../types/customer-restaurant.types";

function RestaurantDetailsContent({ restaurant }: { restaurant: CustomerRestaurantDetails }) {
  const navigate = useNavigate();
  const { data: activeQueueResponse } = useActiveCustomerQueue();
  const [activeTicket, setActiveTicket] = useState<ActiveCustomerTicket | null>(() =>
    activeQueueResponse?.data ?? getActiveCustomerTicket(),
  );

  useEffect(() => {
    setActiveTicket(activeQueueResponse?.data ?? getActiveCustomerTicket());
  }, [activeQueueResponse]);

  useEffect(() => {
    const handleStorage = () => {
      setActiveTicket(getActiveCustomerTicket());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const isJoinedThisQueue = Boolean(
    (activeTicket && activeTicket.restaurantId === restaurant.restaurantId) ||
      restaurant.queue?.hasJoinedThisRestaurantQueue,
  );
  const isJoinedOtherQueue = Boolean(
    (activeTicket && activeTicket.restaurantId !== restaurant.restaurantId) ||
      (restaurant.queue?.hasJoinedAnyQueue && !isJoinedThisQueue),
  );
  const activeQueueEntryId =
    (activeTicket && activeTicket.restaurantId === restaurant.restaurantId
      ? activeTicket.queueEntryId
      : null) ?? restaurant.queue?.queueEntryId ?? null;

  // Enrich restaurant.queue so menu items and checkout know the user is active in queue
  const enrichedRestaurant = useMemo(() => {
    if (!isJoinedThisQueue && !isJoinedOtherQueue) return restaurant;
    return {
      ...restaurant,
      queue: {
        ...restaurant.queue,
        hasJoinedThisRestaurantQueue: isJoinedThisQueue,
        hasJoinedAnyQueue: isJoinedThisQueue || isJoinedOtherQueue,
        isGuestUser: false,
        queueEntryId: activeQueueEntryId,
      },
    };
  }, [restaurant, isJoinedThisQueue, isJoinedOtherQueue, activeQueueEntryId]);

  const categories = useMemo(
    () => [...(enrichedRestaurant.menu ?? [])].sort((a, b) => a.displayOrder - b.displayOrder),
    [enrichedRestaurant.menu],
  );
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "overview");
  const [isJoinQueueOpen, setIsJoinQueueOpen] = useState(false);

  const handleQueueButtonClick = () => {
    if (isJoinedThisQueue && activeQueueEntryId) {
      navigate(CUSTOMER_ROUTES.QUEUE_STATUS(restaurant.restaurantId, activeQueueEntryId));
    } else {
      setIsJoinQueueOpen(true);
    }
  };

  return (
    <>
      <RestaurantCover restaurant={enrichedRestaurant} />
      <div className="mt-7 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <RestaurantMenuNavigation
          categories={categories}
          restaurant={enrichedRestaurant}
          activeId={activeId}
          onActiveChange={setActiveId}
          onJoinQueueClick={handleQueueButtonClick}
          isJoinedThisQueue={isJoinedThisQueue}
          isJoinedOtherQueue={isJoinedOtherQueue}
        />
        <div className="min-w-0 space-y-10">
          <RestaurantMenuSections categories={categories} restaurant={enrichedRestaurant} />
          <RestaurantOverview restaurant={enrichedRestaurant} />
        </div>
      </div>

      <JoinQueueModal
        isOpen={isJoinQueueOpen}
        onClose={() => setIsJoinQueueOpen(false)}
        restaurantId={restaurant.restaurantId}
        restaurantName={restaurant.restaurantName}
        onSuccess={(entry) => {
          navigate(CUSTOMER_ROUTES.QUEUE_STATUS(restaurant.restaurantId, entry.queueEntryId));
        }}
      />
    </>
  );
}

function RestaurantDetailsSkeleton() {
  return (
    <div aria-busy="true">
      <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-white">
        <Skeleton className="h-56 w-full rounded-none bg-stone-200 sm:h-72" />
        <div className="space-y-4 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-64 bg-stone-200" />
            <Skeleton className="h-6 w-20 rounded-full bg-stone-200" />
          </div>
          <Skeleton className="h-4 w-full max-w-2xl bg-stone-200" />
          <Skeleton className="h-4 w-3/4 max-w-xl bg-stone-200" />
          <div className="flex flex-wrap gap-3 pt-1">
            <Skeleton className="h-4 w-28 bg-stone-200" />
            <Skeleton className="h-4 w-24 bg-stone-200" />
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden space-y-3 lg:block" aria-hidden="true">
          <Skeleton className="mb-5 h-5 w-32 bg-stone-200" />
          {[
            "category-one",
            "category-two",
            "category-three",
            "category-four",
            "category-five",
            "category-six",
          ].map((key) => (
            <Skeleton key={key} className="h-10 w-full rounded-xl bg-stone-100" />
          ))}
        </aside>
        <div className="min-w-0 space-y-10">
          <section className="space-y-5" aria-hidden="true">
            <Skeleton className="h-7 w-48 bg-stone-200" />
            <div className="grid gap-4 sm:grid-cols-2">
              {["menu-item-one", "menu-item-two", "menu-item-three", "menu-item-four"].map(
                (key) => (
                  <div key={key} className="flex gap-4 rounded-2xl border border-stone-100 p-4">
                    <Skeleton className="size-20 shrink-0 rounded-xl bg-stone-100" />
                    <div className="flex-1 space-y-3 py-1">
                      <Skeleton className="h-4 w-3/4 bg-stone-200" />
                      <Skeleton className="h-3 w-full bg-stone-100" />
                      <Skeleton className="h-3 w-20 bg-stone-100" />
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>
          <section className="space-y-4 border-t border-stone-200 pt-7" aria-hidden="true">
            <Skeleton className="h-6 w-40 bg-stone-200" />
            <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
              <div className="space-y-3 rounded-2xl border border-stone-100 p-5">
                <Skeleton className="h-5 w-44 bg-stone-200" />
                <Skeleton className="h-3 w-full bg-stone-100" />
                <Skeleton className="h-3 w-4/5 bg-stone-100" />
              </div>
              <div className="space-y-3 rounded-2xl border border-stone-100 p-5">
                <Skeleton className="h-5 w-36 bg-stone-200" />
                <Skeleton className="h-4 w-full bg-stone-100" />
                <Skeleton className="h-4 w-full bg-stone-100" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
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
        <RestaurantDetailsSkeleton />
      ) : isError || !data ? (
        <div role="alert" className="rounded-2xl border border-stone-200 p-12 text-center">
          <h1 className="text-xl font-bold">Couldn't load this restaurant</h1>
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
