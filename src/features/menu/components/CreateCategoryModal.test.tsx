import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateCategoryModal } from "./CreateCategoryModal";

const mockCreateCategory = jest.fn();
jest.mock("@/features/menu/hooks/use-menu-categories", () => ({
  useMenuCategories: () => ({
    createCategory: mockCreateCategory,
    isCreating: false,
    categories: [],
  }),
}));

describe("CreateCategoryModal", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderModal = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CreateCategoryModal isOpen={true} onClose={jest.fn()} restaurantId="res-123" {...props} />
      </QueryClientProvider>,
    );
  };

  it("does not render when isOpen is false", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateCategoryModal isOpen={false} onClose={jest.fn()} restaurantId="res-123" />
      </QueryClientProvider>,
    );

    expect(screen.queryByText("Create Menu Category")).not.toBeInTheDocument();
  });

  it("renders category fields when open", () => {
    renderModal();

    expect(screen.getByText("Create Menu Category")).toBeInTheDocument();
    expect(screen.getByLabelText(/category name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display order/i)).toBeInTheDocument();
  });

  it("shows validation error when category name is empty", async () => {
    const user = userEvent.setup();
    renderModal();

    const submitBtn = screen.getByRole("button", { name: /^create category$/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/category name is required/i)).toBeInTheDocument();
    });
    expect(mockCreateCategory).not.toHaveBeenCalled();
  });

  it("calls createCategory and onCategoryCreated callback on valid submission", async () => {
    const user = userEvent.setup();
    const onCategoryCreated = jest.fn();
    const onClose = jest.fn();

    const createdCat = {
      id: "cat-new",
      restaurantId: "res-123",
      name: "Starters",
      description: "Savory bites",
      displayOrder: 1,
      isActive: true,
    };
    mockCreateCategory.mockResolvedValue(createdCat);

    renderModal({ onCategoryCreated, onClose });

    const nameInput = screen.getByLabelText(/category name/i);
    await user.type(nameInput, "Starters");

    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, "Savory bites");

    const submitBtn = screen.getByRole("button", { name: /^create category$/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateCategory).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Starters",
          description: "Savory bites",
        }),
      );
      expect(onCategoryCreated).toHaveBeenCalledWith(createdCat);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when cancel button is clicked", () => {
    const onClose = jest.fn();
    renderModal({ onClose });

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
    expect(mockCreateCategory).not.toHaveBeenCalled();
  });
});
