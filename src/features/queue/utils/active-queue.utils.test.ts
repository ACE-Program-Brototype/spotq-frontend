import {
  clearActiveCustomerTicket,
  getActiveCustomerTicket,
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
});
