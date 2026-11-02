import { fireEvent, render, screen } from "@testing-library/react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCreateTable } from "../hooks/useCreateTable";
import { useTableSections } from "../hooks/useTableSections";
import CreateTablePage from "./CreateTablePage";

jest.mock("react-router-dom", () => ({
  Link: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <a {...props}>{children}</a>
  ),
  useNavigate: () => jest.fn(),
}));
jest.mock("@/features/auth/store/auth.store", () => ({ useAuthStore: jest.fn() }));
jest.mock("../hooks/useCreateTable", () => ({ useCreateTable: jest.fn() }));
jest.mock("../hooks/useTableSections", () => ({ useTableSections: jest.fn() }));

describe("CreateTablePage", () => {
  const mutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ user: { restaurantId: "restaurant-1" } }),
    );
    (useCreateTable as jest.Mock).mockReturnValue({ mutateAsync, isPending: false });
    (useTableSections as jest.Mock).mockReturnValue({
      sections: [{ id: "section-1", name: "Main" }],
      isLoading: false,
      isError: false,
    });
  });

  it("renders the form and submits table data", async () => {
    render(<CreateTablePage />);

    expect(screen.getByRole("heading", { name: "Create table" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Table name or code"), {
      target: { value: "T1" },
    });
    fireEvent.change(screen.getByLabelText("Dining section"), {
      target: { value: "section-1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create table" }));

    expect(await screen.findByRole("button", { name: "Create table" })).toBeInTheDocument();
    expect(mutateAsync).toHaveBeenCalledWith({
      tableCode: "T1",
      sectionId: "section-1",
      capacity: 2,
      tableShape: "CIRCLE",
    });
  });
});
