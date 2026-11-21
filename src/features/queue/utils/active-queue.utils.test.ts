import {
  clearActiveCustomerTicket,
  formatQueueNumber,
  getActiveCustomerTicket,
  resolveDisplayTableLabel,
  setActiveCustomerTicket,
} from "./active-queue.utils";

describe("active-queue.utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("persists active customer ticket and dispatches storage event", () => {
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");
    const mockTicket = {
      queueEntryId: "entry-123",
      restaurantId: "rest-456",
      queueNumber: "Q-001",
      status: "WAITING",
    };

    setActiveCustomerTicket(mockTicket);

    expect(getActiveCustomerTicket()).toEqual(mockTicket);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe("storage");
  });

  it("clears active customer ticket and dispatches storage event", () => {
    const dispatchSpy = jest.spyOn(window, "dispatchEvent");
    const mockTicket = {
      queueEntryId: "entry-123",
      restaurantId: "rest-456",
    };

    setActiveCustomerTicket(mockTicket);
    expect(getActiveCustomerTicket()).toEqual(mockTicket);

    clearActiveCustomerTicket();
    expect(getActiveCustomerTicket()).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
  });

  it("returns null when storage contains invalid json", () => {
    localStorage.setItem("spotq_active_customer_ticket", "invalid-json{");
    expect(getActiveCustomerTicket()).toBeNull();
  });

  it("formats raw queue numbers without double prefixing", () => {
    expect(formatQueueNumber("Q-001")).toBe("#Q-001");
    expect(formatQueueNumber("#W-012")).toBe("#W-012");
    expect(formatQueueNumber("—")).toBeNull();
    expect(formatQueueNumber("")).toBeNull();
    expect(formatQueueNumber(null)).toBeNull();
  });

  it("resolves human-readable table labels while omitting raw UUIDs", () => {
    expect(resolveDisplayTableLabel("T-04")).toBe("T-04");
    expect(resolveDisplayTableLabel(null, ["T-01", "T-02"])).toBe("T-01, T-02");
    expect(resolveDisplayTableLabel(null, ["f81d4fae-7dec-11d0-a765-00a0c91e6bf6"])).toBeNull();
  });
});
