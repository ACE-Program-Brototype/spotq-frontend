import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { CreateMenuItemForm } from "./CreateMenuItemForm";

const mockCreateMenuItem = jest.fn();
jest.mock("@/features/menu/hooks/use-create-menu-item", () => ({
  useCreateMenuItem: () => ({
    createMenuItem: mockCreateMenuItem,
    isSubmitting: false,
  }),
}));

const mockCategories = [
  { id: "cat-1", restaurantId: "res-100", name: "Burgers", displayOrder: 1, isActive: true },
];

jest.mock("@/features/menu/hooks/use-menu-categories", () => ({
  useMenuCategories: () => ({
    categories: mockCategories,
    isLoading: false,
    createCategory: jest.fn(),
  }),
}));

const mockAddons = [
  { id: "add-1", restaurantId: "res-100", name: "Bacon", price: 60, isAvailable: true },
];

jest.mock("@/features/menu/hooks/use-restaurant-addons", () => ({
  useRestaurantAddons: () => ({
    addons: mockAddons,
    isLoading: false,
    createAddon: jest.fn(),
  }),
}));

jest.mock("@/features/menu/components/ImageUploader", () => ({
  ImageUploader: ({ onChange }: { onChange: (url: string) => void }) => (
    <button
      type="button"
      data-testid="mock-image-uploader"
      onClick={() => onChange("restaurants/res-100/menus/burger.jpg")}
    >
      Upload Image
    </button>
  ),
}));

describe("CreateMenuItemForm", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const renderForm = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CreateMenuItemForm restaurantId="res-100" />
        </BrowserRouter>
      </QueryClientProvider>,
    );
  };

  it("renders basic form fields and initial variant row", () => {
    renderForm();

    expect(screen.getByLabelText(/item name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/menu category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preparation time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText("Portion Sizes & Variants")).toBeInTheDocument();
    expect(screen.getByText("Complementary Add-ons")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^create menu item$/i })).toBeInTheDocument();
  });

  it("shows validation error if required fields are missing on submit", async () => {
    const user = userEvent.setup();
    renderForm();

    const submitBtn = screen.getByRole("button", { name: /^create menu item$/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/menu item name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
      expect(screen.getByText(/^description is required$/i)).toBeInTheDocument();
      expect(screen.getByText(/portion size description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/variant price is required/i)).toBeInTheDocument();
      expect(screen.getByText(/menu item image is required/i)).toBeInTheDocument();
    });
    expect(mockCreateMenuItem).not.toHaveBeenCalled();
  });

  it("submits valid form data with variants and category", async () => {
    const user = userEvent.setup();
    mockCreateMenuItem.mockResolvedValue({ id: "item-123" });

    renderForm();

    // Fill Item Name
    const nameInput = screen.getByLabelText(/item name/i);
    await user.type(nameInput, "Double Cheese Smash");

    // Select Category
    const categorySelect = screen.getByLabelText(/menu category/i);
    await user.selectOptions(categorySelect, "cat-1");

    // Fill Preparation Time
    const prepTimeInput = screen.getByLabelText(/preparation time/i);
    await user.clear(prepTimeInput);
    await user.type(prepTimeInput, "15");

    // Fill Description
    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, "Juicy smashed double patties with melted cheddar cheese");

    // Upload Image
    const uploadBtn = screen.getByTestId("mock-image-uploader");
    await user.click(uploadBtn);

    // Fill default variant name and portion
    const variantNameInput = screen.getByPlaceholderText(/e\.g\., regular, large/i);
    await user.clear(variantNameInput);
    await user.type(variantNameInput, "Regular");

    const portionInput = screen.getByPlaceholderText(/e\.g\., 1 person/i);
    await user.clear(portionInput);
    await user.type(portionInput, "1 Person");

    const priceInput = screen.getByPlaceholderText("0.00");
    await user.clear(priceInput);
    await user.type(priceInput, "280");

    const submitBtn = screen.getByRole("button", { name: /^create menu item$/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateMenuItem).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Double Cheese Smash",
          categoryId: "cat-1",
          description: "Juicy smashed double patties with melted cheddar cheese",
          preparationTime: 15,
          imageUrl: "restaurants/res-100/menus/burger.jpg",
          variants: expect.arrayContaining([
            expect.objectContaining({
              name: "Regular",
              portion: "1 Person",
              price: 280,
              isDefault: true,
            }),
          ]),
        }),
      );
    });
  }, 20000);
});
