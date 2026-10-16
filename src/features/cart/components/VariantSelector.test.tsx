import { fireEvent, render, screen } from "@testing-library/react";
import type { MenuItemDetailVariant } from "@/features/menu/types/menu-item.types";
import { VariantSelector } from "./VariantSelector";

const mockVariants: MenuItemDetailVariant[] = [
  {
    id: "var-1",
    name: "Regular",
    portion: "Serves 1",
    price: 150,
    isDefault: true,
    isAvailable: true,
  },
  {
    id: "var-2",
    name: "Large",
    portion: "Serves 2-3",
    price: 280,
    isDefault: false,
    isAvailable: true,
  },
  {
    id: "var-3",
    name: "Jumbo",
    portion: "Serves 4",
    price: 450,
    isDefault: false,
    isAvailable: false,
  },
];

describe("VariantSelector component", () => {
  it("renders null when variants array is empty", () => {
    const { container } = render(
      <VariantSelector variants={[]} selectedVariantId={null} onSelectVariant={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all variant options with portion and price", () => {
    render(
      <VariantSelector
        variants={mockVariants}
        selectedVariantId="var-1"
        onSelectVariant={jest.fn()}
      />,
    );

    expect(screen.getByText("Regular")).toBeInTheDocument();
    expect(screen.getByText("Serves 1")).toBeInTheDocument();
    expect(screen.getByText("₹150.00")).toBeInTheDocument();

    expect(screen.getByText("Large")).toBeInTheDocument();
    expect(screen.getByText("₹280.00")).toBeInTheDocument();

    expect(screen.getByText("Jumbo")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("calls onSelectVariant when clicking an available variant", () => {
    const handleSelect = jest.fn();
    render(
      <VariantSelector
        variants={mockVariants}
        selectedVariantId="var-1"
        onSelectVariant={handleSelect}
      />,
    );

    fireEvent.click(screen.getByTestId("variant-option-var-2"));
    expect(handleSelect).toHaveBeenCalledWith("var-2");
  });

  it("does not call onSelectVariant when clicking an unavailable variant", () => {
    const handleSelect = jest.fn();
    render(
      <VariantSelector
        variants={mockVariants}
        selectedVariantId="var-1"
        onSelectVariant={handleSelect}
      />,
    );

    fireEvent.click(screen.getByTestId("variant-option-var-3"));
    expect(handleSelect).not.toHaveBeenCalled();
  });
});
