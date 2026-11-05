import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCreateTableSection } from "../hooks/useCreateTableSection";
import { useDeleteTableSection } from "../hooks/useDeleteTableSection";
import { useTableSectionsPaginated } from "../hooks/useTableSectionsPaginated";
import RestaurantTableSectionsPage from "./RestaurantTableSectionsPage";

jest.mock("../hooks/useTableSectionsPaginated");
jest.mock("../hooks/useCreateTableSection");
jest.mock("../hooks/useDeleteTableSection");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("RestaurantTableSectionsPage", () => {
  const mockRefetch = jest.fn();
  const mockCreateMutate = jest.fn();
  const mockDeleteMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.setState({
      user: {
        id: "user-1",
        restaurantId: "rest-123",
        email: "owner@spotq.com",
        role: "RESTAURANT_OWNER",
      },
      isAuthenticated: true,
      accessToken: "token-123",
      savedAt: Date.now(),
    });

    (useTableSectionsPaginated as jest.Mock).mockReturnValue({
      data: {
        mode: "PAGINATED",
        sections: [
          { id: "sec-1", name: "Main Dining" },
          { id: "sec-2", name: "Outdoor Patio" },
        ],
        total: 2,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mockRefetch,
    });

    (useCreateTableSection as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateMutate,
      isPending: false,
    });

    (useDeleteTableSection as jest.Mock).mockReturnValue({
      mutateAsync: mockDeleteMutate,
      isPending: false,
    });
  });

  it("renders live sections from query hook", () => {
    render(
      <MemoryRouter>
        <RestaurantTableSectionsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Table Sections" })).toBeInTheDocument();
    expect(screen.getByText("Main Dining")).toBeInTheDocument();
    expect(screen.getByText("Outdoor Patio")).toBeInTheDocument();
    expect(screen.getByText("Total Sections")).toBeInTheDocument();
  });

  it("opens create modal and invokes create mutation on valid submit", async () => {
    mockCreateMutate.mockResolvedValue({});
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RestaurantTableSectionsPage />
      </MemoryRouter>,
    );

    const openBtn = screen.getByRole("button", { name: /Create Section/i });
    await user.click(openBtn);

    const dialog = screen.getByRole("dialog");
    const input = within(dialog).getByLabelText(/Section Name/i);
    await user.type(input, "Rooftop Garden");

    const submitBtn = within(dialog).getByRole("button", { name: "Create Section" });
    await user.click(submitBtn);

    expect(mockCreateMutate).toHaveBeenCalledWith({ name: "Rooftop Garden" });
  });

  it("opens unlist dialog when clicking Unlist button", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RestaurantTableSectionsPage />
      </MemoryRouter>,
    );

    const unlistButtons = screen.getAllByRole("button", { name: /Unlist section/i });
    await user.click(unlistButtons[0]);

    expect(screen.getByText(/Unlist "Main Dining"?/i)).toBeInTheDocument();
  });

  it("renders empty state when no sections exist", () => {
    (useTableSectionsPaginated as jest.Mock).mockReturnValue({
      data: {
        mode: "PAGINATED",
        sections: [],
        total: 0,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter>
        <RestaurantTableSectionsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("No Table Sections Found")).toBeInTheDocument();
  });

  it("renders error state on query failure", () => {
    (useTableSectionsPaginated as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter>
        <RestaurantTableSectionsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Unable to load table sections/i)).toBeInTheDocument();
  });
});
