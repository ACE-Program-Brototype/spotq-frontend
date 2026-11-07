import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCustomerQueueSocket } from "../hooks/use-customer-queue-socket";
import type { ActiveCustomerTicket, CustomerRingPayload } from "../types/ring-alert.types";
import { clearActiveCustomerTicket, getActiveCustomerTicket } from "../utils/active-queue.utils";
import { CustomerRingAlertModal } from "./CustomerRingAlertModal";

export interface CustomerRingAlertContainerProps {
  /**
   * Explicit queueEntryId to track. If omitted, checks active customer ticket from storage.
   */
  queueEntryId?: string;
  restaurantId?: string;
}

export function CustomerRingAlertContainer({
  queueEntryId,
  restaurantId,
}: CustomerRingAlertContainerProps = {}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [activeTicket, setActiveTicket] = useState<ActiveCustomerTicket | null>(() => {
    if (queueEntryId) {
      return {
        queueEntryId,
        restaurantId: restaurantId || "",
      };
    }
    return getActiveCustomerTicket();
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ringData, setRingData] = useState<CustomerRingPayload | null>(null);

  // Sync ticket when props change
  useEffect(() => {
    if (queueEntryId) {
      setActiveTicket({
        queueEntryId,
        restaurantId: restaurantId || "",
      });
      return;
    }

    setActiveTicket(getActiveCustomerTicket());
  }, [queueEntryId, restaurantId]);

  // Sync with storage changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      if (!queueEntryId) {
        setActiveTicket(getActiveCustomerTicket());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [queueEntryId]);

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
      queueNumber={activeTicket?.queueNumber}
    />
  );
}
