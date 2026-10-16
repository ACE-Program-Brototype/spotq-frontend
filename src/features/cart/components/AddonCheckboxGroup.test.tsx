import { fireEvent, render, screen } from "@testing-library/react";
import type { MenuItemDetailAddon } from "@/features/menu/types/menu-item.types";
import { AddonCheckboxGroup } from "./AddonCheckboxGroup";

const mockAddons: MenuItemDetailAddon[] = [
  {
    id: "add-rel-1",
    addonId: "addon-1",
    name: "Extra Cheese",
    description: "Melted mozzarella",
    price: 45,
    isAvailable: true,
  },
  {
    id: "add-rel-2",
    addonId: "addon-2",
    name: "Garlic Dip",
    price: 0,
    isAvailable: true,
  },
  {
    id: "add-rel-3",
    addonId: "addon-3",
    name: "Truffle Oil",
    price: 80,
    isAvailable: false,
  },
];

describe("AddonCheckboxGroup component", () => {
  it("renders null when addons list is empty", () => {
    const { container } = render(
      <AddonCheckboxGroup addons={[]} selectedAddonIds={[]} onToggleAddon={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all addons with name, description, and price", () => {
    render(
      <AddonCheckboxGroup
        addons={mockAddons}
        selectedAddonIds={["addon-1"]}
        onToggleAddon={jest.fn()}
      />,
    );

    expect(screen.getByText("Extra Cheese")).toBeInTheDocument();
    expect(screen.getByText("Melted mozzarella")).toBeInTheDocument();
    expect(screen.getByText("+₹45.00")).toBeInTheDocument();

    expect(screen.getByText("Garlic Dip")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();

    expect(screen.getByText("Truffle Oil")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("calls onToggleAddon when clicking an available addon", () => {
    const handleToggle = jest.fn();
    render(
      <AddonCheckboxGroup
        addons={mockAddons}
        selectedAddonIds={["addon-1"]}
        onToggleAddon={handleToggle}
      />,
    );

    fireEvent.click(screen.getByTestId("addon-option-addon-2"));
    expect(handleToggle).toHaveBeenCalledWith("addon-2");
  });

  it("does not call onToggleAddon when clicking an unavailable addon", () => {
    const handleToggle = jest.fn();
    render(
      <AddonCheckboxGroup addons={mockAddons} selectedAddonIds={[]} onToggleAddon={handleToggle} />,
    );

    fireEvent.click(screen.getByTestId("addon-option-addon-3"));
    expect(handleToggle).not.toHaveBeenCalled();
  });
});
