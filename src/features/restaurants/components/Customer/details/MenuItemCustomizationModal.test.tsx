import { fireEvent, render, screen } from "@testing-library/react";
import type { CustomerRestaurantMenuItem } from "@/features/restaurants/types/customer-restaurant-details.types";
import { MenuItemCustomizationModal } from "./MenuItemCustomizationModal";

jest.mock("@/features/restaurants/hooks/usePresignedUrl", () => ({
  usePresignedUrl: () => ({ data: null, isLoading: false }),
}));

describe("MenuItemCustomizationModal", () => {
  const mockItemWithCustomizations: CustomerRestaurantMenuItem = {
    id: "item-10",
    name: "Special Biryani",
    description: "Fragrant rice with spices.",
    price: 350,
    preparationTime: 30,
    calories: 600,
    isVegetarian: false,
    isFeatured: true,
    isAvailable: true,
    images: [],
    variants: [
      { id: "v-regular", name: "Regular", price: 350, isDefault: true, isAvailable: true },
      { id: "v-large", name: "Large", price: 500, isDefault: false, isAvailable: true },
      { id: "v-jumbo", name: "Jumbo Family", price: 800, isDefault: false, isAvailable: false },
    ],
    addons: [
      {
        id: "a-raita",
        addonId: "raita",
        name: "Extra Raita",
        description: null,
        price: 40,
        imageKey: null,
        isAvailable: true,
      },
      {
        id: "a-salan",
        addonId: "salan",
        name: "Mirchi Ka Salan",
        description: null,
        price: 50,
        imageKey: null,
        isAvailable: false,
      },
    ],
  };

  it("locks background page scrolling when opened and restores it on unmount", () => {
    document.body.style.overflow = "visible";

    const { unmount } = render(
      <MenuItemCustomizationModal
        item={mockItemWithCustomizations}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("visible");
  });

  it("restores background page scrolling when closed via isOpen prop change", () => {
    document.body.style.overflow = "auto";

    const { rerender } = render(
      <MenuItemCustomizationModal
        item={mockItemWithCustomizations}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <MenuItemCustomizationModal
        item={mockItemWithCustomizations}
        isOpen={false}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(document.body.style.overflow).toBe("auto");
  });

  it("disables selection of unavailable variants", () => {
    render(
      <MenuItemCustomizationModal
        item={mockItemWithCustomizations}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    const unavailableVariant = screen.getByRole("radio", {
      name: /Jumbo Family.*Sold Out/i,
    });
    expect(unavailableVariant).toBeDisabled();
    expect(unavailableVariant).toHaveAttribute("aria-disabled", "true");

    // Attempt to click unavailable variant
    fireEvent.click(unavailableVariant);

    // Default variant Regular should still be selected, Jumbo Family should not be checked
    expect(unavailableVariant).not.toBeChecked();
    const regularVariant = screen.getByRole("radio", { name: /Regular/i });
    expect(regularVariant).toBeChecked();
  });

  it("disables selection of unavailable add-ons", () => {
    render(
      <MenuItemCustomizationModal
        item={mockItemWithCustomizations}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    const unavailableAddon = screen.getByRole("checkbox", {
      name: /Mirchi Ka Salan.*Sold Out/i,
    });
    expect(unavailableAddon).toBeDisabled();
    expect(unavailableAddon).toHaveAttribute("aria-disabled", "true");

    // Click unavailable addon
    fireEvent.click(unavailableAddon);
    expect(unavailableAddon).not.toBeChecked();
  });

  it("allows selecting available variant and add-on, updates total, and confirms order", () => {
    const handleConfirm = jest.fn();
    const handleClose = jest.fn();

    render(
      <MenuItemCustomizationModal
        item={mockItemWithCustomizations}
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />,
    );

    // Switch to Large variant (500)
    const largeVariant = screen.getByRole("radio", { name: /Large/i });
    fireEvent.click(largeVariant);
    expect(largeVariant).toBeChecked();

    // Select available add-on (40)
    const raitaAddon = screen.getByRole("checkbox", { name: /Extra Raita/i });
    fireEvent.click(raitaAddon);
    expect(raitaAddon).toBeChecked();

    // Increase quantity to 2 -> (500 + 40) * 2 = 1080
    const plusButton = screen.getByLabelText("Increase quantity");
    fireEvent.click(plusButton);

    const confirmBtn = screen.getByRole("button", { name: /Add to Cart.*1080/i });
    expect(confirmBtn).not.toBeDisabled();
    fireEvent.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledWith({
      item: mockItemWithCustomizations,
      selectedVariant: expect.objectContaining({ id: "v-large", name: "Large", price: 500 }),
      selectedAddons: [expect.objectContaining({ id: "a-raita", name: "Extra Raita", price: 40 })],
      quantity: 2,
      totalPrice: 1080,
    });
    expect(handleClose).toHaveBeenCalled();
  });

  it("disables confirmation when item itself is sold out", () => {
    const soldOutItem: CustomerRestaurantMenuItem = {
      ...mockItemWithCustomizations,
      isAvailable: false,
    };

    render(
      <MenuItemCustomizationModal
        item={soldOutItem}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    const confirmBtn = screen.getByRole("button", { name: /Add to Cart/i });
    expect(confirmBtn).toBeDisabled();
  });

  it("handles fallback to available variant when default is unavailable", () => {
    const itemWithUnavailableDefault: CustomerRestaurantMenuItem = {
      ...mockItemWithCustomizations,
      variants: [
        { id: "v-1", name: "Small", price: 200, isDefault: true, isAvailable: false },
        { id: "v-2", name: "Medium", price: 300, isDefault: false, isAvailable: true },
      ],
    };

    render(
      <MenuItemCustomizationModal
        item={itemWithUnavailableDefault}
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    const mediumVariant = screen.getByRole("radio", { name: /Medium/i });
    expect(mediumVariant).toBeChecked();
  });

  it("closes modal on Escape key press", () => {
    const handleClose = jest.fn();

    render(
      <MenuItemCustomizationModal
        item={mockItemWithCustomizations}
        isOpen={true}
        onClose={handleClose}
        onConfirm={jest.fn()}
      />,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });
});
