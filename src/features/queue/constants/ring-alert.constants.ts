/**
 * Customer Ring Alert UI and copy constants.
 */
export const RING_ALERT_MESSAGES = {
  TITLE: "Your Table is Ready!",
  DEFAULT_MESSAGE: "Your table is ready! Please proceed to the host desk now to be seated.",
  ACTION_BUTTON: "I'm Heading Over",
  LOCATION_NOTICE: "Please check in with the host at the entrance",
  TICKET_PREFIX: "Ticket",
  CALL_BADGE: (count: number) => `Call #${count} from Host`,
  ASSIGNED_TABLE_SINGULAR: "Assigned Table",
  ASSIGNED_TABLE_PLURAL: "Assigned Tables",
  DISMISS_BACKDROP_LABEL: "Dismiss alert backdrop",
} as const;
