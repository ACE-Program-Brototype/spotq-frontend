import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCustomerQueueSocket } from "../hooks/use-customer-queue-socket";
import type { ActiveCustomerTicket, CustomerRingPayload } from "../types/ring-alert.types";
import {
  clearActiveCustomerTicket,
  getActiveCustomerTicket,
  setActiveCustomerTicket,
} from "../utils/active-queue.utils";
import { CustomerRingAlertModal } from "./CustomerRingAlertModal";

export interface CustomerRingAlertContainerProps {
  /**
   * Explicit queueEntryId to track. If omitted, checks active customer ticket from storage.
   */
  queueEntryId?: string;
  restaurantId?: string;
}

export function CustomerRingAlertContainer({
  queueEntryId: propQueueEntryId,
  restaurantId: propRestaurantId,
}: CustomerRingAlertContainerProps = {}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [activeTicket, setActiveTicket] = useState<ActiveCustomerTicket | null>(() => {
    if (propQueueEntryId) {
      return {
        queueEntryId: propQueueEntryId,
        restaurantId: propRestaurantId || "",
      };
    }
    return getActiveCustomerTicket();
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ringData, setRingData] = useState<CustomerRingPayload | null>(null);

  // Sync ticket when propQueueEntryId changes or from URL search params
  useEffect(() => {
    if (propQueueEntryId) {
      setActiveTicket({
        queueEntryId: propQueueEntryId,
        restaurantId: propRestaurantId || "",
      });
      return;
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTicketId = params.get("ticketId") || params.get("queueEntryId");
      if (urlTicketId) {
        const ticket: ActiveCustomerTicket = {
          queueEntryId: urlTicketId,
          restaurantId: params.get("restaurantId") || "",
        };
        setActiveCustomerTicket(ticket);
        setActiveTicket(ticket);
        return;
      }
    }

    setActiveTicket(getActiveCustomerTicket());
  }, [propQueueEntryId, propRestaurantId]);

  // Sync with storage changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      if (!propQueueEntryId) {
        setActiveTicket(getActiveCustomerTicket());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [propQueueEntryId]);

  const handleRing = useCallback((data: CustomerRingPayload) => {
    setRingData(data);
    setIsModalOpen(true);
  }, []);

  const handleSeated = useCallback(() => {
    setIsModalOpen(false);
    clearActiveCustomerTicket();
    setActiveTicket(null);
  }, []);

  const handleCancelled = useCallback(() => {
    setIsModalOpen(false);
    clearActiveCustomerTicket();
    setActiveTicket(null);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useCustomerQueueSocket(activeTicket?.queueEntryId, accessToken, {
    onRing: handleRing,
    onSeated: handleSeated,
    onCancelled: handleCancelled,
  });

  if (!isModalOpen) {
    return null;
  }

  return (
    <CustomerRingAlertModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      message={ringData?.message}
      ringCount={ringData?.ringCount ?? 1}
      assignedTableIds={ringData?.assignedTableIds || ringData?.tableNumbers}
      queueNumber={activeTicket?.queueNumber}
    />
  );
}
