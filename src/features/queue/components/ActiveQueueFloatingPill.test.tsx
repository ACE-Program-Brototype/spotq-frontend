import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ACTIVE_QUEUE_STORAGE_KEY } from "../constants/websocket.constants";
import { ActiveQueueFloatingPill } from "./ActiveQueueFloatingPill";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ActiveQueueFloatingPill", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders nothing when there is no active ticket in localStorage", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ActiveQueueFloatingPill />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when user is currently on the queue tracker page", () => {
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({
        queueEntryId: "entry-123",
        restaurantId: "rest-456",
        queueNumber: "Q-010",
      }),
    );

    const { container } = render(
      <MemoryRouter initialEntries={["/restaurants/rest-456/queue/status?queueEntryId=entry-123"]}>
        <ActiveQueueFloatingPill />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders floating pill when user has an active ticket and is on another page", () => {
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({
        queueEntryId: "entry-123",
        restaurantId: "rest-456",
        queueNumber: "Q-010",
      }),
    );

    render(
      <MemoryRouter initialEntries={["/restaurants/rest-456"]}>
        <ActiveQueueFloatingPill />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /view active queue status/i })).toBeInTheDocument();
    expect(screen.getByText(/In Line • #Q-010/i)).toBeInTheDocument();
  });

  it("navigates to the queue tracker page on click", () => {
    localStorage.setItem(
      ACTIVE_QUEUE_STORAGE_KEY,
      JSON.stringify({
        queueEntryId: "entry-123",
        restaurantId: "rest-456",
        queueNumber: "Q-010",
      }),
    );

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ActiveQueueFloatingPill />
      </MemoryRouter>,
    );

    const pill = screen.getByRole("button", { name: /view active queue status/i });
    fireEvent.click(pill);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/restaurants/rest-456/queue/status?queueEntryId=entry-123",
    );
  });
});
