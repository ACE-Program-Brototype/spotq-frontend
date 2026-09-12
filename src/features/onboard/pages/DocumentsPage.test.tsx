import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import * as storageService from "@/services/storage/storage.service";
import { useOnboardStore } from "../store/onboard.store";
import DocumentsPage from "./DocumentsPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/services/storage/storage.service");

describe("DocumentsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardStore.getState().resetOnboardStore();
    useAuthStore.setState({
      user: {
        email: "test@restaurant.com",
        restaurantId: "123e4567-e89b-12d3-a456-426614174000",
        role: "RESTAURANT_ADMIN",
      },
      accessToken: "mock-token",
      isAuthenticated: true,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <DocumentsPage />
      </BrowserRouter>,
    );

  it("renders all 5 document upload fields and restaurant photos section", () => {
    renderComponent();

    expect(screen.getByText("Documents & Photos")).toBeInTheDocument();
    expect(screen.getByText("FSSAI Certificate")).toBeInTheDocument();
    expect(screen.getByText("Business Registration Certificate")).toBeInTheDocument();
    expect(screen.getByText("Owner Identity Proof")).toBeInTheDocument();
    expect(screen.getByText("GST Certificate")).toBeInTheDocument();
    expect(screen.getByText("Business PAN Card")).toBeInTheDocument();
    expect(screen.getByText("Restaurant Photos")).toBeInTheDocument();
  });

  it("shows validation error if Continue is clicked without required uploads", async () => {
    renderComponent();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    expect(
      await screen.findByText(/please upload all required business documents before proceeding/i),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith("/restaurant/onboarding/review");
  });

  it("validates invalid file type for document upload", async () => {
    renderComponent();

    const file = new File(["dummy image"], "invalid.jpg", { type: "image/jpeg" });
    const inputs = document.querySelectorAll('input[type="file"]');
    const fssaiInput = inputs[0] as HTMLInputElement;

    fireEvent.change(fssaiInput, { target: { files: [file] } });

    expect(
      await screen.findByText(/invalid file type. only pdf documents are allowed/i),
    ).toBeInTheDocument();
  });

  it("validates oversized file for document upload", async () => {
    renderComponent();

    // 6MB file
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "large.pdf", {
      type: "application/pdf",
    });
    const inputs = document.querySelectorAll('input[type="file"]');
    const fssaiInput = inputs[0] as HTMLInputElement;

    fireEvent.change(fssaiInput, { target: { files: [largeFile] } });

    expect(await screen.findByText(/file size exceeds the 5mb limit/i)).toBeInTheDocument();
  });

  it("handles successful document upload and updates store state", async () => {
    (storageService.uploadFile as jest.Mock).mockResolvedValue({
      s3ObjectKey: "restaurants/123/documents/fssai_cert.pdf",
      fileName: "fssai_cert.pdf",
    });

    renderComponent();

    const pdfFile = new File(["pdf content"], "fssai_cert.pdf", { type: "application/pdf" });
    const inputs = document.querySelectorAll('input[type="file"]');
    const fssaiInput = inputs[0] as HTMLInputElement;

    fireEvent.change(fssaiInput, { target: { files: [pdfFile] } });

    await waitFor(() => {
      expect(storageService.uploadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          file: pdfFile,
          entityType: "restaurants",
          entityId: "123e4567-e89b-12d3-a456-426614174000",
          fileCategory: "DOCUMENTS",
        }),
      );
    });

    expect(await screen.findByText("fssai_cert.pdf")).toBeInTheDocument();
    expect(useOnboardStore.getState().documents.fssai).toEqual({
      documentName: "fssai_cert.pdf",
      documentKey: "restaurants/123/documents/fssai_cert.pdf",
    });
  });

  it("navigates back to business information when Back is clicked", async () => {
    renderComponent();

    const backButton = screen.getByRole("button", { name: /back/i });
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/business-information");
  });

  it("navigates to review page when required documents and photo are uploaded without optional ones", async () => {
    useOnboardStore.setState({
      documents: {
        fssai: { documentName: "fssai.pdf", documentKey: "key/fssai.pdf" },
        businessRegistration: { documentName: "reg.pdf", documentKey: "key/reg.pdf" },
        ownerIdentity: { documentName: "identity.pdf", documentKey: "key/identity.pdf" },
        gst: null,
        businessPan: null,
      },
      restaurantImages: [{ fileName: "photo1.jpg", objectKey: "key/photo1.jpg", displayOrder: 1 }],
    });

    renderComponent();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    await userEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith("/restaurant/onboarding/review");
  });

  it("disables Add Photo button and prevents uploading when 5 photos exist", () => {
    useOnboardStore.setState({
      restaurantImages: Array.from({ length: 5 }, (_, i) => ({
        fileName: `photo${i + 1}.jpg`,
        objectKey: `key/photo${i + 1}.jpg`,
        displayOrder: i + 1,
      })),
    });

    renderComponent();

    const addPhotoButton = screen.getByRole("button", { name: /limit reached/i });
    expect(addPhotoButton).toBeDisabled();
  });
});
